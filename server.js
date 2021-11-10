const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const fs = require('fs');
const csv = require('fast-csv');
const mysql = require('mysql2')
const multer = require('multer')
const path = require('path')


//use express static folder
app.use(express.static("./public"))

// body-parser middleware use
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port:3308,
    password: "",
    database: "covid"
})

db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

//! Uso de Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

//! Routes start

//route for Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//@type   POST
// upload csv to database
app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    UploadCsvDataToMySQL(__dirname + '/uploads/' + req.file.filename);
    //UploadCsvDataToMySQL(__dirname + req.file.filename);
    console.log('CSV file data has been uploaded in mysql database ' + err);
});

function UploadCsvDataToMySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
 
            // Open the MySQL connection
            db.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    //let query = 'INSERT INTO customercovid (id, data_notificacao, data_primeiros_sintomas, data_teste, data_obito, data_nascimento, faixa_idade, sexo, raca, bairro, municipio_residencia, saude, tipo_teste, dor_garganta, dispneia, febre, tosse, obito, internado_uti) VALUES ?';
                    let query = 'INSERT INTO covid2 (data_notificacao,data_encerramento,data_primeiros_sintomas,data_teste,data_obito,data_nascimento,faixa_idade,sexo,raca,bairro, municipio_residencia,uf_residencia,centro_saude,tipo_teste,classificacao_final,dor_garganta,dispneia,febre, tosse,outros,doenca_resp_descompensada,doenca_card_cronica,diabetes,doencas_renais_avancado,imunossupressao, gestante_alto_risco,portador_doenca_cromossomica,solicitado,coletado,concluido,cancelado,ignorado,obito,cura, internado,internado_uti,tratamento_domiciliar) VALUES ?';
                    db.query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
            
            // delete file after saving to MySQL database
            // -> you can comment the statement to see the uploaded CSV file.
            fs.unlinkSync(filePath)
        });
 
    stream.pipe(csvStream);
}

//create connection
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
