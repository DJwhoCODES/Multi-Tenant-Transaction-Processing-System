FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (ensure it matches .env PORT)
EXPOSE 3005

# Start the service
CMD ["node", "index.js"]
