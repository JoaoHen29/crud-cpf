# CRUD CPF - Express + JSON Server

CRUD de pessoas com busca por CPF, hospedado no Render.

## Estrutura

```
server.js            -> servidor Express + JSON Server (rotas /pessoas)
db.json              -> banco de dados (JSON Server)
public/
  index.html         -> página inicial (menu)
  css/style.css      -> estilo de todas as páginas
  get/    index.html + get.js     -> GET    (listar / buscar por CPF)
  post/   index.html + post.js    -> POST   (cadastrar)
  put/    index.html + put.js     -> PUT    (buscar por CPF e atualizar)
  delete/ index.html + delete.js  -> DELETE (buscar por CPF e excluir)
```

Campos: cpf, nome, sobrenome, email, idade, telefone, rua, bairro, cidade, estado, rg.

## Rodar localmente

```
npm install
node server.js
```
Abrir http://localhost:3000

## Render
- Build Command: `npm install`
- Start Command: `node server.js`
