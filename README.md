# Expense Tracker

This is a Next.js expense tracking application using AWS services.

## Features
- User authentication with AWS Cognito
- Expense management with AWS DynamoDB
- Dashboard with spending analytics
- Category-based expense tracking

## Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Authentication:** AWS Cognito
- **Database:** AWS DynamoDB
- **Backend:** Next.js API Routes (can be migrated to Lambda)
- **Deployment:** AWS Amplify

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up AWS Amplify backend:
   - Install Amplify CLI: `npm install -g @aws-amplify/cli`
   - Initialize Amplify: `amplify init`
   - Add authentication: `amplify add auth`
   - Add API (DynamoDB): `amplify add api` (choose GraphQL or REST)
   - Push to AWS: `amplify push`
4. Update environment variables in `.env.local`:
   - `AWS_REGION`
   - `DYNAMODB_TABLE`
5. Run locally: `npm run dev`

## Deployment
- Connect to AWS Amplify Console
- Use the provided `amplify.yml` for build settings
- Deploy with backend resources
