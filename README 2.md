# USA Rakhi E-commerce Website

A modern, mobile-first e-commerce website for selling Rakhi and Rakhi gift combos in the USA, built with Next.js and AWS serverless architecture.

## Features

### Customer Features
- 🏠 Home page with featured products
- 🛍️ Product listing and detail pages
- 🛒 Shopping cart and checkout
- 👤 User authentication (login/signup)
- 📦 Order tracking and confirmation
- 🎁 Guest checkout option
- 🏷️ Coupon codes and promotions

### Product Categories
- Rakhi
- Rakhi + Chocolate Combo
- Rakhi + Roli + Moli
- Rakhi + Flowers
- Premium Rakhi Gift Hampers

### Admin Features
- Add/update products
- Manage inventory
- View orders
- Upload product images

## Tech Stack

### Frontend
- **Next.js** - React framework with SSR/SSG
- **Tailwind CSS** - Styling
- **Stripe Elements** - Payment integration

### Backend (AWS Serverless)
- **AWS Lambda** - Serverless compute
- **API Gateway** - REST API
- **DynamoDB** - NoSQL database
- **AWS Cognito** - Authentication
- **S3** - File storage
- **CloudFront** - CDN

### Infrastructure
- **AWS SAM** - Infrastructure as Code
- **GitHub Actions** - CI/CD

## Architecture

```
CloudFront → S3 (Frontend)
         → API Gateway → Lambda → DynamoDB
         → Cognito (Auth)
         → S3 (Product Images)
```

## Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Stripe account for payments

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd usarakhi.com
```

2. Install dependencies
```bash
cd frontend
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Deploy infrastructure
```bash
cd infrastructure
sam deploy --guided
```

5. Deploy frontend
```bash
cd frontend
npm run build
npm run export
# Deploy to S3/CloudFront
```

## Project Structure

```
usarakhi.com/
├── frontend/              # Next.js application
│   ├── pages/            # Next.js pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and API calls
│   ├── styles/          # CSS and styling
│   └── public/          # Static assets
├── backend/             # AWS Lambda functions
│   ├── functions/       # Lambda function code
│   ├── layers/         # Shared dependencies
│   └── events/         # API Gateway events
├── infrastructure/      # AWS SAM templates
│   ├── template.yaml   # Main CloudFormation template
│   └── policies/       # IAM policies
├── .github/workflows/   # GitHub Actions workflows
└── docs/               # Documentation
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
# Local testing with SAM CLI
sam local start-api
```

### Testing
```bash
# Frontend tests
npm test

# Backend tests
npm test --prefix backend
```

## Deployment

### Infrastructure Deployment
```bash
cd infrastructure
sam build
sam deploy --guided
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run export
aws s3 sync out/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### CI/CD
GitHub Actions will automatically:
1. Build and test the application
2. Deploy infrastructure changes
3. Deploy frontend updates
4. Invalidate CloudFront cache

## Environment Variables

### Frontend (.env.local)
```
  NEXT_PUBLIC_API_URL=https://api.usarakhi.com
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_...
  NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

### Backend (Lambda Environment)
```
STRIPE_SECRET_KEY=sk_test_...
DYNAMODB_TABLE_NAME=usarakhi-products
COGNITO_USER_POOL_ID=us-east-1_...
```

## API Endpoints

### Public Endpoints
- `GET /products` - List all products
- `GET /products/{id}` - Get product details
- `POST /cart` - Add item to cart
- `POST /checkout` - Process checkout

### Authenticated Endpoints
- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order details
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

### Admin Endpoints
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product
- `GET /admin/orders` - List all orders

## Security

- HTTPS enforced via CloudFront
- JWT token-based authentication
- Input validation and sanitization
- AWS WAF for DDoS protection
- Secure environment variables

## Performance

- CDN caching for static assets
- Database connection pooling
- Image optimization and compression
- Lazy loading for product images
- Server-side rendering for SEO

## Monitoring

- AWS CloudWatch for logs and metrics
- API Gateway usage plans and throttling
- Lambda function monitoring
- Frontend error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For technical issues or questions, please:
1. Check the documentation in `/docs`
2. Create an issue on GitHub
3. Contact the development team

## Deployment Checklist

- [ ] Configure AWS CLI with appropriate permissions
- [ ] Set up Stripe account and get API keys
- [ ] Create S3 buckets for frontend and assets
- [ ] Configure CloudFront distribution
- [ ] Set up Cognito user pool
- [ ] Deploy infrastructure with SAM
- [ ] Deploy frontend to S3
- [ ] Configure DNS and SSL certificates
- [ ] Test all functionality
- [ ] Set up monitoring and alerts