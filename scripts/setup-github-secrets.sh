#!/bin/bash

# Script to help set up GitHub secrets for frontend deployment

echo "🔧 Setting up GitHub secrets for frontend deployment"
echo "=================================================="

echo ""
echo "You need to add these secrets to your GitHub repository:"
echo ""

echo "📋 Required Secrets:"
echo "-------------------"
echo "AWS_ACCESS_KEY_ID: Your AWS access key"
echo "AWS_SECRET_ACCESS_KEY: Your AWS secret key"
echo ""

echo "📋 Optional Secrets (for environment variables):"
echo "-----------------------------------------------"
echo "STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key"
echo "COGNITO_USER_POOL_ID: Your Cognito User Pool ID"
echo "COGNITO_CLIENT_ID: Your Cognito Client ID"
echo ""

echo "💡 How to add secrets:"
echo "1. Go to your GitHub repository"
echo "2. Click on 'Settings' tab"
echo "3. Click on 'Secrets and variables' → 'Actions'"
echo "4. Click 'New repository secret'"
echo "5. Add each secret with its value"
echo ""

echo "📋 Example values to add:"
echo "------------------------"
echo "AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE"
echo "AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
echo "STRIPE_PUBLISHABLE_KEY: pk_test_[your-stripe-key]"
echo "COGNITO_USER_POOL_ID: us-east-1_3l64ld774pbq2u3sj2cikvhrp2"
echo "COGNITO_CLIENT_ID: 3l64ld774pbq2u3sj2cikvhrp2"
echo ""

echo "⚠️  Important Notes:"
echo "------------------"
echo "1. Make sure your AWS credentials have the required permissions"
echo "2. The AWS credentials should have access to:"
echo "   - CloudFormation"
echo "   - Lambda"
echo "   - API Gateway"
echo "   - S3"
echo "   - CloudFront"
echo "   - IAM"
echo "3. For production, use dedicated deployment credentials"
echo ""

echo "🚀 After setting up secrets, push to GitHub and the workflow will:"
echo "1. Build your frontend"
echo "2. Deploy the frontend infrastructure (Lambda + API Gateway + CloudFront)"
echo "3. Upload your code and assets"
echo "4. Invalidate CloudFront cache"
echo "5. Provide you with the frontend URL"
echo ""

echo "🔗 Your website will be accessible at:"
echo "https://[cloudfront-id].cloudfront.net"