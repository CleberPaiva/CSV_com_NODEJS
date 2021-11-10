# CSV_com_NODEJS
Aplicação com NODE.JS para ler arquivo CSV, parte do projeto final do curso de WEB Desenvolvedor da UFSC 2021.


Node js Upload / Importação de CSV para MySQL

Importar e fazer upload de csv para banco de dados MySQL no Node js + Express; Por meio deste tutorial, vou mostrar como você pode importar / fazer upload de arquivos CSV para o banco de dados MySQL usando Node js + Express + fast-csv.
Todas essas tarefas são muito comuns e fáceis. Upload de csv por meio do aplicativo node js + express. Em seguida, extraia os dados lendo o arquivo CSV nas rotas ou controlador do nó. Além disso, inserir os dados extraídos no banco de dados MySQL.
Como importar / fazer upload de arquivo CSV no MySQL usando Node.js
•	Etapa 1 - Criar Node JS App
•	Etapa 2 - instalar os pacotes js de nós necessários
•	Etapa 3 - Criar tabela no banco de dados MySQL
•	Etapa 4 - Criar arquivo Server.js e importar módulos para ele
•	Etapa 5 - Criar rotas CSV / upload
•	Etapa 6 - Criar formulário de upload de CSV
•	Etapa 7 - iniciar o servidor de aplicativos


Etapa 1 - Criar Node JS App
Execute o seguinte comando no terminal para criar o aplicativo node js:

mkdir meu-app
cd meu-app
npm init


Etapa 2 - instalar os pacotes js de nós necessários
Instale os módulos node js necessários; Portanto, execute o seguinte comando para instalar dependências express e multer em seu aplicativo node js:
npm install express multer body-parser mysql fast-csv


Etapa 3 - Criar tabela no banco de dados MySQL
Execute a seguinte consulta sql para criar uma tabela em seu banco de dados:
CREATE TABLE `customer` (
        `data_notificacao` date(30) DEFAULT NULL,
	`data_primeiros_sintomas` date(30) DEFAULT NULL,
	`data_teste` date(30) DEFAULT NULL,
	`data_obito` date(30) DEFAULT NULL,
        `data_nascimento` date(30) DEFAULT NULL,
	`faixa_idade` varchar(20) DEFAULT NULL,
	`sexo` varchar(20) DEFAULT NULL,
	`raca` varchar(30) DEFAULT NULL,
        `bairro` varchar(120) DEFAULT NULL,
	`municipio_residencia` varchar(120) DEFAULT NULL,
	`centro_saude` varchar(120) DEFAULT NULL,
	`tipo_teste` varchar(120) DEFAULT NULL,
        `dor_garganta` varchar(15) DEFAULT NULL,
	`dispneia` varchar(15) DEFAULT NULL,
	`febre` varchar(15) DEFAULT NULL,
	`tosse` varchar(15) DEFAULT NULL,
        `obito` varchar(15) DEFAULT NULL,
	`internado_uti`varchar(15) DEFAULT NULL,
) ENGINE=MyISAM DEFAULT CHARSET=utf8

Etapa 4 - Criar arquivo Server.js e importar módulos para ele
Crie o arquivo server.js; então visite o diretório raiz do seu aplicativo e crie-o. 
A importação acima instalou módulos node js nele; como mostrado abaixo:

const express = require ( 'express' )
const app = express ( )
const bodyparser = require ( 'body-parser' )
const fs = require ( 'fs' ) ;
const csv = require ( 'fast-csv' ) ;
const mysql = require ( 'mysql' )
const multer = require ( 'multer' )
const path = require ( 'path' )


Etapa 5 - Criar rotas de importação / upload de CSV
Crie rotas para upload de imagens; portanto, abra seu arquivo server.js e adicione as seguintes rotas a ele:

const express = require ( 'express' )
const app = express ( )
const bodyparser = require ( 'body-parser' )
const fs = require ( 'fs' ) ;
const csv = require ( 'fast-csv' ) ;
const mysql = require ( 'mysql' )
const multer = require ( 'multer' )
const path = require ( 'path' )
// use a pasta estática expressa
aplicativo. usar ( expresso. estático ( "./public" ) )
// uso de middleware analisador de corpo
aplicativo. use ( bodyparser. json ( ) )
aplicativo. use ( bodyparser. urlencoded ( {
estendido: verdadeiro
}))
// Conexão de banco de dados
const db = mysql. createConnection ( {
host: "localhost" ,
usuário: "root" ,
senha: "" ,
banco de dados: "teste"
})
db. conectar ( função ( errar ) { 
if ( err ) { 
console de retorno . erro ( 'erro:' + mensagem err. ) ; 
}
console . log ( 'Conectado ao servidor MySQL.' ) ;
})
//! Uso de Multer
var storage = multer. diskStorage ( {
destino: ( req, arquivo, callBack ) => { 
callBack ( null , './uploads/' ) 
},
nome do arquivo: ( req, arquivo, callBack ) => { 
callBack ( null , file. fieldname + '-' + Date. now ( ) + path. extname ( file. originalname ) )
}
})
var upload = nuvem ( {
armazenamento: armazenamento
});
//! Início das rotas
// rota para a página inicial
aplicativo. get ( '/' , ( req, res ) => { 
res. sendFile ( __dirname + '/index.html' ) ;
});
// @ type POST
// upload csv para banco de dados
aplicativo. post ( '/ uploadfile' , upload. single ( "uploadfile" ) , ( req, res ) => { 
UploadCsvDataToMySQL ( __dirname + '/ uploads /' + req. File . Filename ) ;
console . log ( 'Os dados do arquivo CSV foram enviados para o banco de dados mysql' + err ) ;
});
function UploadCsvDataToMySQL ( filePath ) { 
deixe stream = fs. createReadStream ( filePath ) ;
deixe csvData = [ ] ;
deixe csvStream = csv
. parse ( )
. on ( "dados" , função ( dados ) { 
csvData. push ( dados ) ;
})
. on ( "fim" , função ( ) { 
// Remove Header ROW
csvData. shift ( ) ;
// Abra a conexão MySQL
db. conectar ( ( erro ) => { 
if ( erro ) { 
console . erro ( erro ) ;
} else { 
let query = 'INSERT INTO customer (id, address, name, age) VALUES?' ;
db. consulta ( consulta, [ csvData ] , ( erro, resposta ) => { 
console . log ( erro || resposta ) ;
});
}
});
// exclua o arquivo após salvar no banco de dados MySQL
// -> você pode comentar a declaração para ver o arquivo CSV carregado.
fs. unlinkSync ( filePath )
});
Stream. tubo ( csvStream ) ;
}
// criar conexão
const PORT = processo. env . PORT || 3000
aplicativo. listen ( PORT, ( ) => console . log ( `Server is running on port $ {PORT} ` ) ) 



Etapa 6 - Criar formulário de upload de CSV
Crie o arquivo index.html; adicione o seguinte código de marcação html para o formulário de upload de arquivo:

<! DOCTYPE html>
< html lang = "en" > 
< cabeça >
< title > Node js carrega arquivo csv para banco de dados MySQL - Laratutorials.com </ title >
< meta charset = "UTF-8" > 
< meta name = "viewport" content = "width = device-width, initial-scale = 1" > 
</ head >
< corpo >
< h1 > Node js carrega arquivo csv para banco de dados MySQL - Laratutorials.com </ h1 >
< form action = "/ uploadfile" enctype = "multipart / form-data" method = "post" > 
< input type = "file" name = "uploadfile" accept = 'csv' > 
< input type = "submit" value = "Upload CSV" > 
</ form > 
</ body >
</ html >


Etapa 7 - iniciar o servidor de aplicativos
Execute o seguinte no terminal para iniciar o servidor de aplicativos:
//run the below command

npm start

after run this command open your browser and hit 

http://127.0.0.1:3000/

Conclusão
Importar e fazer upload de csv para banco de dados MySQL no Node js + Express; Por meio deste tutorial, você aprendeu como importar 
/ fazer upload de arquivo CSV para o banco de dados MySQL usando Node js + Express + fast-csv.


Fonte primária: https://laratutorials.com/node-js-upload-import-csv-to-mysql/
