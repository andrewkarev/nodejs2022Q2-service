FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:migrate:dev"]