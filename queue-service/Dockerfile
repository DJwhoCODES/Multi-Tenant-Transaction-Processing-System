FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# No port exposed, it's a background queue worker
CMD ["node", "index.js"]
