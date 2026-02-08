# Frontend Deployment Guide

This guide provides complete instructions for deploying your Next.js frontend to AWS using Lambda + API Gateway.

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Node.js 20+** installed
3. **jq** installed (for JSON parsing)
4. **AWS credentials** with permissions for:
   - CloudFormation
   - Lambda
   - API Gateway
   - S3
   - CloudFront
   - IAM

### Deploy Frontend

```bash
# Deploy to development stage
./scripts/deploy-frontend.sh dev

# Deploy to staging stage
./scripts/deploy-frontend.sh staging

# Deploy to production stage
./scripts/deploy-frontend.sh prod
```

## 📋 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   API Gateway    │    │   Lambda        │
│   (CDN)         │    │   (REST API)     │    │   (Next.js)     │
│                 │    │                  │    │                 │
│  Static Assets  │◄──►│  Route: {proxy+} │◄──►│  Server Handler │
│  (S3 Origin)    │    │  Method: ANY     │    │  (Next.js App)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   S3 Bucket     │    │   IAM Roles      │    │   Environment   │
│   (Assets)      │    │   (Permissions)  │    │   Variables     │
│                 │    │                  │    │                 │
│  Public Assets  │    │  Lambda Execution│    │  API URLs       │
│  (Images, etc)  │    │  API Gateway     │    │  Cognito Config │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Manual Deployment Steps

### 1. Build Frontend

```bash
cd frontend
npm install --no-audit --no-fund
npm run build
```

### 2. Deploy CloudFormation Stack

```bash
# Deploy the frontend infrastructure
aws cloudformation create-stack \
    --stack-name usarakhi-frontend-dev \
    --template-body file://infrastructure/frontend-template.yaml \
    --parameters \
        ParameterKey=Stage,ParameterValue=dev \
        ParameterKey=FrontendDomain,ParameterValue=usarakhi.com \
    --capabilities CAPABILITY_IAM \
    --region us-east-1
```

### 3. Upload Deployment Package

```bash
# Create deployment package
zip -r frontend-server.zip .next package.json server.js

# Upload to S3 deployment bucket
aws s3 cp frontend-server.zip s3://usarakhi-frontend-deployment-dev/frontend-server.zip
```

### 4. Update Lambda Function

```bash
# Update Lambda with new code
aws lambda update-function-code \
    --function-name usarakhi-frontend-dev \
    --s3-bucket usarakhi-frontend-deployment-dev \
    --s3-key frontend-server.zip
```

### 5. Upload Static Assets

```bash
# Sync public assets to S3
aws s3 sync frontend/public/ s3://usarakhi-frontend-assets-dev/ --delete
```

### 6. Invalidate CloudFront

```bash
# Invalidate cache
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

## 🌐 Environment Variables

The frontend Lambda function uses these environment variables:

```bash
NEXT_PUBLIC_API_URL=https://[api-id].execute-api.us-east-1.amazonaws.com/dev/
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-key]
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_[your-user-pool-id]
NEXT_PUBLIC_COGNITO_CLIENT_ID=[your-client-id]
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 📊 Monitoring

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/usarakhi-frontend-dev --follow
```

### API Gateway Metrics

```bash
# View API Gateway metrics
aws apigateway get-stage \
    --rest-api-id [api-id] \
    --stage-name dev
```

### CloudFront Metrics

```bash
# View CloudFront metrics
aws cloudfront get-distribution \
    --id [distribution-id]
```

## 🚨 Troubleshooting

### Common Issues

1. **Lambda Timeout**
   - Increase timeout to 30 seconds
   - Check for long-running operations

2. **API Gateway Errors**
   - Verify Lambda permissions
   - Check integration settings

3. **CloudFront Cache Issues**
   - Invalidate cache after deployment
   - Check origin configuration

4. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names

### Debug Commands

```bash
# Test Lambda function
aws lambda invoke \
    --function-name usarakhi-frontend-dev \
    --payload '{"httpMethod":"GET","path":"/"}' \
    response.json

# Test API Gateway
curl https://[api-id].execute-api.us-east-1.amazonaws.com/dev/

# Check CloudFront status
aws cloudfront get-distribution \
    --id [distribution-id] \
    --query 'Distribution.Status'
```

## 🔄 CI/CD Integration

### GitHub Actions

Add this to your `.github/workflows/main.yml`:

```yaml
deploy-frontend:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Deploy frontend
      run: |
        chmod +x scripts/deploy-frontend.sh
        ./scripts/deploy-frontend.sh ${{ github.ref_name }}
```

### Environment Variables in CI

Set these secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`

## 📈 Performance Optimization

### Lambda Optimization

1. **Memory Size**: 1024MB (adjust based on needs)
2. **Timeout**: 30 seconds
3. **Layers**: Use AWS Lambda Powertools for TypeScript

### CloudFront Optimization

1. **Cache Policies**: Use managed policies for static assets
2. **Origin Request Policies**: Pass all viewer headers
3. **Compression**: Enable Gzip/Brotli compression

### Next.js Optimization

1. **Image Optimization**: Use CloudFront for image delivery
2. **Static Assets**: Leverage S3 for static file serving
3. **API Routes**: Keep API routes minimal for Lambda performance

## 🔒 Security Considerations

1. **IAM Permissions**: Use least privilege principle
2. **Environment Variables**: Store secrets securely
3. **CORS**: Configure proper CORS settings
4. **HTTPS**: Enforce HTTPS everywhere
5. **WAF**: Consider AWS WAF for additional protection

## 📞 Support

For issues or questions:

1. Check the [AWS Documentation](https://docs.aws.amazon.com/)
2. Review CloudWatch logs for errors
3. Check CloudFormation stack events
4. Verify IAM permissions

## 📝 Notes

- This deployment uses server-side rendering (SSR) with Next.js
- Static assets are served via S3 + CloudFront
- API routes are handled by the same Lambda function
- Client-side routing is managed by CloudFront function
- The deployment is fully serverless and scalable