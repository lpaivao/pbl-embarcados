FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Aguarda o banco estar disponível antes de iniciar
CMD ["sh", "-c", "sleep 10 && npm run dev"]