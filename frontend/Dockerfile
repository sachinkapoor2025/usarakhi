# Use AWS Lambda Node.js 20 runtime image
FROM public.ecr.aws/lambda/nodejs:20

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Set the entry point
CMD ["server.handler"]
