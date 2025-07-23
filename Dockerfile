FROM ubi8/nodejs-20

# Define o diretório de trabalho como /opt/app-root/src
WORKDIR /opt/app-root/src

# Copia os arquivos do diretório atual para o diretório de trabalho
COPY . .

# Instala as dependências do projeto
RUN npm install

# Executa o comando de construção do projeto Next.js
RUN npm run build

# Define o comando para iniciar o aplicativo Next.js
CMD npm start
