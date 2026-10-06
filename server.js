// Importa o Express (servidor web) e o JSON Server (banco de dados em db.json)
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

// Cria a aplicação Express
const app = express();

// Cria o roteador do JSON Server a partir do arquivo db.json
// Ele gera automaticamente as rotas GET, POST, PUT, PATCH e DELETE em /pessoas
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Middlewares padrão do JSON Server (logger, CORS, body-parser)
const middlewares = jsonServer.defaults({ static: path.join(__dirname, 'public') });

// Porta: o Render define a variável PORT; localmente usamos 3000
const porta = process.env.PORT || 3000;

// Serve as páginas HTML, CSS e JS da pasta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(middlewares);

// Rota principal: página inicial com o menu do CRUD
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Usa as rotas do JSON Server (ex.: /pessoas, /pessoas/1, /pessoas?cpf=...)
app.use(router);

// Inicia o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
