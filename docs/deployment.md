# Deployment Guide

This guide walks you through deploying the Usa Rakhi e-commerce application to AWS.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- Stripe account for payment processing
- AWS SAM CLI (for local development)
- GitHub repository with secrets configured

## Environment Setup

### 1. AWS Configuration

Ensure your AWS CLI is configured with a user that has the following permissions:
- CloudFormation (Create, Update, Delete stacks)
- Lambda (Create, Update, Delete functions)
- API Gateway (Create, Update, Delete APIs)
- DynamoDB (Create, Update, Delete tables)
- S3 (Create, Update, Delete buckets and objects)
- IAM (Create roles and policies)

```bash
aws configure
```

### 2. Required AWS Services

The application requires these AWS services:
- **API Gateway** - REST API endpoints
- **Lambda** - Serverless compute
- **DynamoDB** - NoSQL database
- **S3** - Static file hosting
- **CloudFront** - CDN
- **Cognito** - Authentication (to be set up separately)

### 3. Environment Variables

Set up the following environment variables:

#### Backend Environment Variables
```bash
export STRIPE_SECRET_KEY="your_stripe_secret_key"
export COGNITO_USER_POOL_ID="your_cognito_user_pool_id"
export COGNITO_CLIENT_ID="your_cognito_client_id"
export FRONTEND_URL="https://your-frontend-url.com"
```

#### GitHub Secrets (for CI/CD)
Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `COGNITO_CLIENT_ID` - Cognito App Client ID
- `FRONTEND_URL` - Frontend application URL

## Manual Deployment

### 1. Deploy Backend Infrastructure

```bash
cd infrastructure
sam build --template template.yaml
sam deploy \
  --stack-name usarakhi-dev \
  --parameter-overrides \
    Stage=dev \
    StripeSecretKey=$STRIPE_SECRET_KEY \
    CognitoUserPoolId=$COGNITO_USER_POOL_ID \
    CognitoClientId=$COGNITO_CLIENT_ID \
    FrontendUrl=$FRONTEND_URL \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset
```

### 2. Get API URL

```bash
aws cloudformation describe-stacks \
  --stack-name usarakhi-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text
```

### 3. Deploy Frontend

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=<your-api-url> npm run build
npm run export

# Create S3 bucket
aws s3 mb s3://usarakhi-frontend-dev --region us-east-1

# Deploy to S3
aws s3 sync out/ s3://usarakhi-frontend-dev/ --delete

# Set up CloudFront (manual or via AWS Console)
```

## Automated Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically:

1. **Tests** - Runs frontend and backend tests
2. **Builds** - Compiles and builds the application
3. **Deploys** - Deploys infrastructure and frontend
4. **Validates** - Runs security scans and performance tests

### Workflow Triggers

- **Push to `main`** - Deploys to production
- **Push to `develop`** - Deploys to staging
- **Pull Request to `main`** - Runs tests and security scans

### Manual Workflow Trigger

You can manually trigger the deployment workflow:

```bash
# Via GitHub CLI
gh api repos/owner/repo/actions/workflows/deploy.yml/dispatches \
  -f ref=main
```

## Cognito Setup

### 1. Create User Pool

1. Go to AWS Cognito Console
2. Create a new User Pool
3. Configure:
   - **App clients** - Add your frontend application
   - **Domain name** - Set up a custom domain
   - **App integration** - Configure callback URLs

### 2. Set Up Identity Pool (Optional)

For unauthenticated access:
1. Create an Identity Pool
2. Link to your User Pool
3. Configure IAM roles for authenticated and unauthenticated users

### 3. Update Application Configuration

Update your frontend configuration with Cognito details:

```env
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain
```

## Stripe Setup

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard

### 2. Configure Webhooks

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-api-url/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret

### 3. Update Environment Variables

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Monitoring and Logging

### CloudWatch Logs

Lambda functions automatically log to CloudWatch. Access logs via:

```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/
```

### API Gateway Monitoring

Monitor API usage and errors:

```bash
aws apigateway get-stage --rest-api-id <api-id> --stage-name <stage>
```

### Performance Monitoring

The deployment includes:
- **Lighthouse CI** for frontend performance
- **CloudWatch Metrics** for backend monitoring
- **AWS X-Ray** for distributed tracing

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API Gateway CORS configuration
   - Verify frontend URL in environment variables

2. **Authentication Failures**
   - Verify Cognito User Pool ID and Client ID
   - Check JWT token format and expiration

3. **Payment Processing Errors**
   - Verify Stripe API keys
   - Check webhook endpoint and secret

4. **Deployment Failures**
   - Check CloudFormation stack events
   - Verify IAM permissions
   - Check S3 bucket permissions

### Debug Commands

```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name usarakhi-dev

# Check Lambda function logs
aws logs tail /aws/lambda/function-name --follow

# Test API endpoints
curl https://api-id.execute-api.region.amazonaws.com/dev/products

# Check S3 bucket contents
aws s3 ls s3://usarakhi-frontend-dev/
```

## Rollback Procedures

### Infrastructure Rollback

```bash
# View stack change sets
aws cloudformation list-change-sets --stack-name usarakhi-dev

# Rollback to previous version
aws cloudformation update-stack \
  --stack-name usarakhi-dev \
  --use-previous-template \
  --capabilities CAPABILITY_IAM
```

### Frontend Rollback

```bash
# List S3 object versions
aws s3api list-object-versions --bucket usarakhi-frontend-dev

# Restore previous version
aws s3api restore-object \
  --bucket usarakhi-frontend-dev \
  --key index.html \
  --restore-request Days=1
```

## Cost Optimization

### Development Environment

- Use `PAY_PER_REQUEST` for DynamoDB
- Set CloudWatch log retention to 7 days
- Use smaller Lambda memory allocations (128MB-512MB)

### Production Environment

- Enable auto-scaling for Lambda
- Use provisioned concurrency for critical functions
- Set up CloudFront caching
- Monitor and optimize API Gateway usage

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to version control
   - Use AWS Secrets Manager for sensitive data
   - Rotate API keys regularly

2. **IAM Permissions**
   - Use principle of least privilege
   - Regularly audit IAM policies
   - Use IAM roles instead of access keys when possible

3. **API Security**
   - Enable API Gateway throttling
   - Use AWS WAF for DDoS protection
   - Implement proper input validation

4. **Data Protection**
   - Enable encryption at rest for DynamoDB
   - Use HTTPS for all endpoints
   - Implement proper backup strategies

## Support

For deployment issues or questions:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review AWS documentation
3. Contact the development team