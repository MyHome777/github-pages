# Usar una imagen oficial de Node.js
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# IMPORTANTE: Hugging Face espera que uses el puerto 7860
EXPOSE 7860

# Comando para iniciar
CMD [ "node", "index.js" ]