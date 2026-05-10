FROM node:18-slim

RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server/ .

EXPOSE 3000

CMD ["node", "server.js"]