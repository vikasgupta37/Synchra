FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the front-end app
RUN npm run build

# Expose the API port
EXPOSE 8080

# Serve the app
CMD ["node", "server.js"]
