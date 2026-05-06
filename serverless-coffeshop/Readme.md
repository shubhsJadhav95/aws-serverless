# ☕ Velvet Grounds - Serverless Coffee Shop

A **full-stack serverless application** built with AWS services for managing coffee inventory. Features a React frontend with beautiful UI and scalable serverless backend.

![Velvet Grounds Architecture](image.png)

---

## 🏗️ Architecture Overview

* **Database**: Amazon DynamoDB
* **Backend**: AWS Lambda (Node.js)
* **API Layer**: Amazon API Gateway
* **Frontend**: React + Vite
* **Storage**: Amazon S3
* **CDN**: Amazon CloudFront
* **Dependency Management**: Lambda Layers

---

## ✨ Features

* 🎨 **Modern UI** - Beautiful coffee shop interface with icons and animations
* 📱 **Responsive Design** - Works on desktop and mobile devices
* ⚡ **Serverless Backend** - Auto-scaling, pay-per-use architecture
* 🔐 **Authentication Ready** - AWS Cognito integration (optional)
* 🗂️ **CRUD Operations** - Create, read, update, delete coffee items
* 📊 **Real-time Updates** - Instant UI updates without page refresh
* 🌍 **Global CDN** - Fast content delivery via CloudFront

---

## 📋 Prerequisites

* AWS Account with appropriate permissions
* Node.js 18+ installed
* AWS CLI configured
* Basic knowledge of React and JavaScript

---

## 🚀 Quick Start

### 1. DynamoDB Table Setup

Create a DynamoDB table with the following configuration:

```bash
# Table Name: CoffeeTable
# Primary Key: coffeeId (String)
# Attributes:
# - coffeeId (String) - Primary Key
# - name (String) - Coffee name
# - price (Number) - Price in dollars
# - available (Boolean) - Availability status
```

### 2. IAM Role Creation

Create an IAM role with:

**Managed Policy:**
* `AWSLambdaBasicExecutionRole`

**Inline Policy for DynamoDB:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:dynamodb:*:*:table/CoffeeTable"
    }
  ]
}
```

### 3. Lambda Functions Development

Create Lambda functions using AWS SDK v3:

**Reference:** [AWS SDK JavaScript Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html)

#### Example: `createCoffee.js`
```javascript
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const { coffeeId, name, price, available } = JSON.parse(event.body);

  const params = {
    TableName: "CoffeeTable",
    Item: {
      coffeeId: { S: coffeeId },
      name: { S: name },
      price: { N: price.toString() },
      available: { BOOL: available }
    }
  };

  try {
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Coffee created successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 4. Lambda Layer Creation

**Create shared dependencies layer:**
```bash
# Create layer directory structure
mkdir -p layer/nodejs
cd layer/nodejs

# Install dependencies
npm init -y
npm install @aws-sdk/client-dynamodb uuid

# Create layer zip
cd ../../
zip -r layer.zip layer/
```

**Upload and attach layer:**
1. Upload `layer.zip` to AWS Lambda Layers
2. Attach layer to all Lambda functions
3. Set compatible runtime: Node.js 18.x

### 5. API Gateway Configuration

Create REST API with the following routes:

| Method | Path | Lambda Function | Description |
|--------|------|----------------|-------------|
| GET | `/coffee` | `listCoffees` | Get all coffee items |
| GET | `/coffee/{id}` | `getCoffee` | Get specific coffee |
| POST | `/coffee` | `createCoffee` | Create new coffee |
| PUT | `/coffee/{id}` | `updateCoffee` | Update coffee |
| DELETE | `/coffee/{id}` | `deleteCoffee` | Delete coffee |

**Integration Settings:**
* Use **Lambda Proxy Integration**
* Enable **CORS** for frontend access
* Deploy to a stage (e.g., `prod`)

### 6. Frontend Development

**Setup and build:**
```bash
cd frontend
npm install
npm run build
```

**Environment Configuration:**
```bash
# frontend/.env
VITE_API_URL="https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod"
```

### 7. S3 Bucket Setup

**Create S3 bucket for static hosting:**
```bash
aws s3 mb s3://velvet-grounds-coffee-shop
aws s3api put-bucket-policy --bucket velvet-grounds-coffee-shop --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::velvet-grounds-coffee-shop/*"
    }
  ]
}'
```

**Upload frontend:**
```bash
aws s3 sync frontend/dist/ s3://velvet-grounds-coffee-shop/ --delete
```

### 8. CloudFront Distribution

**Create distribution with two origins:**

1. **S3 Origin** (Primary)
   * Origin: S3 bucket
   * Origin Access Control: Enabled
   * Path Pattern: `Default (*)`

2. **API Gateway Origin** (Secondary)
   * Origin: API Gateway endpoint
   * Path Pattern: `/coffee/*`

**Cache Behaviors:**
```
Path Pattern: /coffee/* → API Gateway Origin
Origin: API Gateway
Cache Policy: Managed-CachingOptimized
Viewer Protocol Policy: Redirect-to-HTTPS

Path Pattern: Default (*) → S3 Origin
Origin: S3 Bucket
Cache Policy: Managed-CachingOptimized
Viewer Protocol Policy: Redirect-to-HTTPS
```

---

## 📁 Project Structure

```
serverless-coffeshop/
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── ItemDetails.jsx  # Coffee detail view
│   │   ├── utils/
│   │   │   └── apis.js      # API utility functions
│   │   └── main.jsx         # Application entry point
│   ├── dist/                # Build output
│   └── package.json
│
├── lambda/                   # Lambda functions
│   ├── createCoffee.js
│   ├── getCoffee.js
│   ├── listCoffees.js
│   ├── updateCoffee.js
│   └── deleteCoffee.js
│
├── lambdaLayer/              # Shared dependencies
│   └── nodejs/
│       └── node_modules/
│
├── image.png                # Architecture diagram
└── README.md
```

---

## 🧪 API Testing (Postman)

**Base URL:** `https://your-api.execute-api.us-east-1.amazonaws.com/prod`

### Test Endpoints:

**GET All Coffees:**
```http
GET /coffee
```

**GET Specific Coffee:**
```http
GET /coffee/ESP-001
```

**Create Coffee:**
```http
POST /coffee
Content-Type: application/json

{
  "coffeeId": "LAT-001",
  "name": "Latte",
  "price": 4.50,
  "available": true
}
```

**Update Coffee:**
```http
PUT /coffee/LAT-001
Content-Type: application/json

{
  "name": "Oat Latte",
  "price": 5.00,
  "available": true
}
```

**Delete Coffee:**
```http
DELETE /coffee/LAT-001
```

---

## 🎨 Frontend Features

### Coffee Management Interface
- **Add Coffee**: Form with validation and toast notifications
- **Coffee Cards**: Beautiful cards with icons and status badges
- **Filter Options**: Filter by availability status
- **Edit Mode**: Inline editing with save/cancel options
- **Delete Confirmation**: Modal confirmation for deletions
- **Responsive Grid**: Adaptive layout for different screen sizes

### UI Components
- **Modern Design**: Clean, professional interface
- **Coffee Icons**: Dynamic icons based on coffee type
- **Status Badges**: Visual availability indicators
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error display

---

## 🔧 Configuration Details

### Lambda Function Examples

**listCoffees.js:**
```javascript
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async () => {
  const params = {
    TableName: "CoffeeTable"
  };

  try {
    const result = await client.send(new ScanCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ Items: result.Items })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Environment Variables

**Lambda Functions:**
```bash
TABLE_NAME=CoffeeTable
AWS_REGION=us-east-1
```

**Frontend:**
```bash
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

---

## 📊 Monitoring & Logging

### CloudWatch Metrics
* Lambda function invocations
* API Gateway request counts
* Error rates and latency
* DynamoDB read/write capacity

### Logging
* Lambda function logs via CloudWatch
* API Gateway execution logs
* Frontend error tracking

---

## 🚀 Deployment Steps

1. **Infrastructure Setup**
   - Create DynamoDB table
   - Set up IAM roles and policies
   - Create Lambda layer

2. **Backend Deployment**
   - Develop Lambda functions
   - Upload and configure functions
   - Create API Gateway routes

3. **Frontend Deployment**
   - Build React application
   - Upload to S3 bucket
   - Configure CloudFront distribution

4. **Testing & Validation**
   - Test API endpoints with Postman
   - Verify frontend functionality
   - Check CloudFront caching

---

## 🔒 Security Considerations

* **IAM Permissions**: Follow principle of least privilege
* **API Security**: Enable API Gateway throttling and usage plans
* **CORS Configuration**: Restrict origins in production
* **S3 Security**: Use Origin Access Control for CloudFront
* **Environment Variables**: Store sensitive data in AWS Secrets Manager

---

## 💰 Cost Optimization

* **Lambda Layers**: Reduce deployment package sizes
* **CloudFront Caching**: Minimize API calls and S3 requests
* **DynamoDB On-Demand**: Pay-per-request pricing
* **S3 Storage Classes**: Use appropriate storage classes

---

## 🔄 CI/CD Pipeline (Optional)

```yaml
# GitHub Actions example
name: Deploy Serverless Coffee Shop
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to S3
        run: aws s3 sync frontend/dist/ s3://velvet-grounds-coffee-shop/
      - name: Update Lambda Functions
        run: |
          # Deploy Lambda functions
          # Update API Gateway if needed
```

---

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
```javascript
// Add to Lambda responses
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
}
```

**DynamoDB Permissions:**
```bash
# Verify IAM role permissions
aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::ACCOUNT:role/LambdaRole --action-names dynamodb:PutItem --resource-arns arn:aws:dynamodb:*:*:table/CoffeeTable
```

**CloudFront Invalidation:**
```bash
# Clear cache after deployment
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

---

## 📈 Future Enhancements

* **Authentication**: AWS Cognito integration
* **Infrastructure as Code**: AWS CDK or Terraform
* **Advanced Features**: Coffee recommendations, orders, analytics
* **Performance**: Database indexing, caching strategies
* **Monitoring**: Enhanced logging and alerting
* **Testing**: Automated testing pipeline

---

## 📞 Support

For issues and questions:
1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Test API endpoints independently
4. Review CloudFront distribution settings

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for coffee lovers everywhere!**

