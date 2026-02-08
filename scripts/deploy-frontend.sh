#!/bin/bash

# Frontend Deployment Script for Next.js on AWS Lambda + API Gateway

set -e

# Configuration
STAGE=${1:-dev}
AWS_REGION=${2:-us-east-1}
STACK_NAME="usarakhi-frontend-${STAGE}"
TEMPLATE_FILE="infrastructure/frontend-template.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting frontend deployment for stage: ${STAGE}${NC}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Frontend directory not found. Please run from project root.${NC}"
    exit 1
fi

# Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend
npm install --no-audit --no-fund
npm run build

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd ..

# Create temporary directory for deployment
TEMP_DIR="temp-deployment"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy frontend build files
cp -r frontend/.next $TEMP_DIR/
cp -r frontend/public $TEMP_DIR/ 2>/dev/null || true
cp frontend/package.json $TEMP_DIR/
cp frontend/package-lock.json $TEMP_DIR/ 2>/dev/null || true

# Create server.js for Lambda
cat > $TEMP_DIR/server.js << 'EOF'
const { createServer, proxy } = require('aws-serverless-express');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

let server;

async function getServer() {
  if (!server) {
    await app.prepare();
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
  }
  return server;
}

module.exports.handler = async (event, context) => {
  const server = await getServer();
  return proxy(server, event, context);
};
EOF

# Create package.json for Lambda
cat > $TEMP_DIR/package.json << 'EOF'
{
  "name": "usarakhi-frontend-lambda",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "aws-serverless-express": "^3.3.9",
    "aws-lambda": "^1.0.6"
  }
}
EOF

# Install Lambda dependencies
cd $TEMP_DIR
npm install --production --no-audit --no-fund

# Create deployment zip
echo -e "${YELLOW}📦 Creating deployment zip...${NC}"
zip -r ../frontend-server.zip . -x "node_modules/aws-sdk/*"

cd ..
rm -rf $TEMP_DIR

# Deploy CloudFormation stack
echo -e "${YELLOW}☁️  Deploying CloudFormation stack...${NC}"

# Check if stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION &> /dev/null; then
    echo -e "${YELLOW}🔄 Updating existing stack...${NC}"
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=Stage,ParameterValue=$STAGE \
            ParameterKey=FrontendDomain,ParameterValue=usarakhi.com \
        --capabilities CAPABILITY_IAM \
        --region $AWS_REGION \
        --no-fail-on-empty-changeset
else
    echo -e "${YELLOW}🆕 Creating new stack...${NC}"
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=Stage,ParameterValue=$STAGE \
            ParameterKey=FrontendDomain,ParameterValue=usarakhi.com \
        --capabilities CAPABILITY_IAM \
        --region $AWS_REGION
fi

# Wait for stack deployment
echo -e "${YELLOW}⏳ Waiting for stack deployment to complete...${NC}"
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION || \
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $AWS_REGION

# Get stack outputs
echo -e "${YELLOW}📋 Getting stack outputs...${NC}"
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION --query 'Stacks[0].Outputs' --output json)

FRONTEND_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="FrontendUrl") | .OutputValue')
API_GATEWAY_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="ApiGatewayUrl") | .OutputValue')
LAMBDA_FUNCTION_ARN=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="NextJsLambdaFunction") | .OutputValue')
DEPLOYMENT_BUCKET=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="FrontendAssetsBucket") | .OutputValue')

# Upload deployment package to S3
echo -e "${YELLOW}📤 Uploading deployment package to S3...${NC}"
aws s3 cp frontend-server.zip s3://$DEPLOYMENT_BUCKET/frontend-server.zip --region $AWS_REGION

# Update Lambda function code
echo -e "${YELLOW}🔄 Updating Lambda function code...${NC}"
aws lambda update-function-code \
    --function-name $(echo $LAMBDA_FUNCTION_ARN | cut -d: -f6) \
    --s3-bucket $DEPLOYMENT_BUCKET \
    --s3-key frontend-server.zip \
    --region $AWS_REGION

# Upload static assets to S3
echo -e "${YELLOW}📤 Uploading static assets to S3...${NC}"
if [ -d "frontend/public" ]; then
    aws s3 sync frontend/public/ s3://$DEPLOYMENT_BUCKET/ --delete --region $AWS_REGION
fi

# Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
CLOUDFRONT_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontDistributionId") | .OutputValue')
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --region $AWS_REGION

# Clean up
rm -f frontend-server.zip

echo -e "${GREEN}✅ Frontend deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend URL: ${FRONTEND_URL}${NC}"
echo -e "${GREEN}🔗 API Gateway URL: ${API_GATEWAY_URL}${NC}"

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
sleep 30  # Wait for deployment to propagate

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
if [ $HTTP_STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Frontend is accessible at: ${FRONTEND_URL}${NC}"
else
    echo -e "${RED}❌ Frontend test failed with status: ${HTTP_STATUS}${NC}"
    echo -e "${YELLOW}💡 This might be normal if the deployment is still propagating. Please try again in a few minutes.${NC}"
fi