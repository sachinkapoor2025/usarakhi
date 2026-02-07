# Usa Rakhi E-commerce Architecture

## Overview

This document describes the architecture of the Usa Rakhi e-commerce application, a modern serverless solution for selling Rakhi products in the USA.

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   API Gateway    │    │   S3 (Static)   │
│   (CDN)         │    │   (REST API)     │    │   (Frontend)    │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          │                      │                       │
          ▼                      ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Route 53      │    │   Lambda         │    │   S3 (Assets)   │
│   (DNS)         │    │   (Functions)    │    │   (Images)      │
└─────────────────┘    └─────────┬────────┘    └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   DynamoDB      │
                          │   (Database)    │
                          └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   Stripe API    │
                          │   (Payments)    │
                          └─────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **AWS Amplify** - Cognito integration
- **Stripe Elements** - Payment UI components
- **SWR** - Data fetching
- **Sonner** - Toast notifications

### Backend (AWS Serverless)
- **AWS Lambda** - Serverless compute (Node.js 18.x)
- **API Gateway** - REST API with CORS and authentication
- **DynamoDB** - NoSQL database with GSIs
- **AWS SAM** - Infrastructure as Code
- **Stripe** - Payment processing

### Infrastructure
- **S3** - Static website hosting and asset storage
- **CloudFront** - Content delivery network
- **Route 53** - DNS management
- **AWS WAF** - Web application firewall
- **CloudWatch** - Monitoring and logging

## Data Model

### DynamoDB Table Structure

The application uses a single DynamoDB table with a partition key (`PK`) and sort key (`SK`) design:

```
Table: usarakhi-{stage}

Partition Key (PK): Entity type + ID
Sort Key (SK): Entity type + ID
GSI1PK: Secondary partition key for queries
GSI1SK: Secondary sort key for queries
```

#### Product Entity
```
PK: PRODUCT#{id}
SK: PRODUCT#{id}
GSI1PK: PRODUCT#ACTIVE (if active) or PRODUCT#INACTIVE
GSI1SK: PRODUCT#{id}
name: string
description: string
price: number
category: string
images: array
stock: number
sku: string
deliveryInfo: object
isActive: boolean
createdAt: string
updatedAt: string
```

#### Cart Entity
```
PK: CART#{id}
SK: CART#{id}
GSI1PK: USER#{userId}
GSI1SK: CART#{id}
userId: string
productId: string
quantity: number
price: number
name: string
image: string
createdAt: string
updatedAt: string
```

#### Order Entity
```
PK: ORDER#{id}
SK: ORDER#{id}
GSI1PK: USER#{userId}
GSI1SK: ORDER#{id}
userId: string
status: string
paymentStatus: string
paymentIntentId: string
stripeSessionId: string
items: array
totals: object
shippingAddress: object
billingAddress: object
deliveryDate: string
giftMessage: string
createdAt: string
updatedAt: string
```

## API Endpoints

### Public Endpoints
- `GET /products` - List all active products
- `GET /products/{id}` - Get specific product
- `POST /cart` - Add item to cart
- `GET /cart` - Get user's cart
- `PUT /cart/{itemId}` - Update cart item
- `DELETE /cart/{itemId}` - Remove cart item
- `POST /checkout` - Create checkout session

### Authenticated Endpoints
- `GET /orders` - Get user's orders
- `GET /orders/{id}` - Get specific order

### Admin Endpoints
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/{id}` - Update order status

## Security

### Authentication & Authorization
- **AWS Cognito** - User authentication and management
- **JWT Tokens** - API authentication
- **IAM Roles** - Lambda function permissions
- **API Gateway Authorizers** - Request validation

### Data Protection
- **HTTPS** - All traffic encrypted
- **DynamoDB Encryption** - Data at rest encrypted
- **Environment Variables** - Secrets management
- **Input Validation** - Request sanitization

### API Security
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API Gateway throttling
- **AWS WAF** - DDoS protection
- **Cognito User Pools** - User management

## Performance

### Frontend Optimization
- **SSR/SSG** - Next.js rendering strategies
- **Image Optimization** - Next.js image component
- **Lazy Loading** - Component and image lazy loading
- **Bundle Splitting** - Code splitting and tree shaking
- **CDN Caching** - CloudFront edge caching

### Backend Optimization
- **Lambda Provisioned Concurrency** - Reduced cold starts
- **DynamoDB Auto Scaling** - Automatic scaling
- **Connection Pooling** - Database connection reuse
- **Caching** - API Gateway caching

### Database Optimization
- **GSIs** - Secondary indexes for queries
- **Partition Keys** - Optimized for access patterns
- **Provisioned Throughput** - Pay-per-request billing
- **Stream Processing** - Real-time data processing

## Monitoring & Observability

### Application Monitoring
- **CloudWatch Logs** - Lambda function logs
- **CloudWatch Metrics** - API Gateway and Lambda metrics
- **AWS X-Ray** - Distributed tracing
- **Custom Metrics** - Business metrics

### Infrastructure Monitoring
- **Health Checks** - Service health monitoring
- **Alerts** - CloudWatch alarms
- **Dashboards** - Custom monitoring dashboards
- **Performance Insights** - Database performance

## Deployment & CI/CD

### Development Workflow
1. **Feature Branches** - Git workflow
2. **Pull Requests** - Code review process
3. **Automated Testing** - Unit and integration tests
4. **Security Scanning** - Vulnerability detection

### Deployment Pipeline
1. **GitHub Actions** - CI/CD automation
2. **Environment Promotion** - Dev → Staging → Production
3. **Infrastructure as Code** - SAM templates
4. **Blue-Green Deployment** - Zero-downtime deployments

### Environment Management
- **Development** - Feature development and testing
- **Staging** - Pre-production testing
- **Production** - Live application

## Cost Optimization

### Development Environment
- **Pay-per-Request** - DynamoDB billing
- **Lambda Free Tier** - Free tier utilization
- **Log Retention** - Limited log retention
- **Resource Cleanup** - Automatic cleanup

### Production Environment
- **Auto Scaling** - Dynamic resource allocation
- **Reserved Capacity** - Cost savings for predictable load
- **Caching** - Reduced API calls
- **Monitoring** - Cost tracking and optimization

## Scalability

### Horizontal Scaling
- **Lambda** - Automatic scaling
- **API Gateway** - Built-in scaling
- **DynamoDB** - Unlimited scaling
- **CloudFront** - Global edge network

### Vertical Scaling
- **Lambda Memory** - Configurable memory allocation
- **Provisioned Concurrency** - Pre-warmed instances
- **DynamoDB Read/Write Capacity** - Adjustable throughput

## Disaster Recovery

### Backup Strategy
- **DynamoDB Backups** - Automated backups
- **S3 Versioning** - Object versioning
- **Code Repository** - Git-based backup

### Recovery Procedures
- **Infrastructure Recovery** - SAM stack recreation
- **Data Recovery** - Point-in-time recovery
- **Application Recovery** - Blue-green deployment rollback

## Future Enhancements

### Planned Features
- **Mobile App** - React Native application
- **Push Notifications** - Order updates
- **Recommendation Engine** - Personalized suggestions
- **Multi-language Support** - Internationalization
- **Advanced Analytics** - Business intelligence

### Architecture Improvements
- **Event-Driven Architecture** - SNS/SQS integration
- **Microservices** - Service decomposition
- **GraphQL API** - Alternative API approach
- **Edge Computing** - Lambda@Edge functions