# Imagem oficial do Node.js
FROM node:18

# Pasta de trabalho dentro do container
WORKDIR /main

EXPOSE 3000

# Copia os arquivos do projeto
COPY . /main

# Instala as dependências
RUN npm install

# Comando de inicialização (npm start -> node server.js)
CMD ["npm", "start"]
