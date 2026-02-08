# Use Node.js 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build tools and AWS Lambda Runtime Interface Client
RUN apk add --no-cache python3 make g++ cmake && \
    npm install -g aws-lambda-ric

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose the port (not required for Lambda but good practice)
EXPOSE 3000

# Set the entry point
CMD ["aws-lambda-ric", "server.handler"]