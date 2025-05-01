FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# No port exposed since it's a cron job
CMD ["node", "index.js"]
