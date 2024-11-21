# My Fashion Trunk

Web application for analyzing fashion items using AI image recognition.

## Live Demo

The application is currently running on AWS:

- Frontend: [http://my-fashion-trunk-alb-1332421404.eu-north-1.elb.amazonaws.com/](http://my-fashion-trunk-alb-1332421404.eu-north-1.elb.amazonaws.com/) currently not working, can be relaunched if requested
- Backend: [http://my-fashion-trunk-backend-alb-203446907.eu-north-1.elb.amazonaws.com](http://my-fashion-trunk-backend-alb-203446907.eu-north-1.elb.amazonaws.com) currently not working, can be relaunched if requested

## Project Structure

```
my-fashion-trunk/
├── frontend/     # React + TypeScript frontend application
└── backend/      # NestJS backend application
```

## Installation & Running Options

You can run this project either locally or using Docker. Choose the method that best suits your needs.

### Option 1: Local Installation

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the backend directory with the following variables:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/fashion-trunk
   STORAGE_TYPE=local
   AWS_REGION=your-region
   AWS_REKOGNITION_REGION=your-rekognition-region
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   BASE_URL=http://localhost:3000
   ```

4. Start the backend server:

   ```bash
   npm run start:local
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:

   ```bash
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

### Option 2: Docker Installation

#### Prerequisites

- Docker
- Docker Compose

1. Create a .env.local file in the backend directory with the following variables:

   ```bash
   # Backend Environment Variables
   PORT=3000
   MONGODB_URI=mongodb://mongodb:27017/fashion-trunk
   STORAGE_TYPE=local
   AWS_REGION=your-region
   AWS_REKOGNITION_REGION=your-rekognition-region
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   BASE_URL=http://localhost:3000
   ```

2. Create a .env.local file in the frontend directory with the following variables:

   ```bash
   # Frontend Environment Variables
   VITE_API_URL=http://localhost:3000
   ```

3. Build and run the containers:

   ```bash
   docker-compose up --build
   ```

The application will be available at:

- Frontend: http://localhost:80
- Backend: http://localhost:3000

## Environment Variables

### Backend Variables

- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `STORAGE_TYPE`: Storage type ('local' or 's3')
- `AWS_REGION`: AWS region for S3
- `AWS_REKOGNITION_REGION`: AWS region for Rekognition
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `BASE_URL`: Backend base URL
- `AWS_S3_BUCKET`: S3 bucket name (if using S3 storage)

### Frontend Variables

- `VITE_API_URL`: Backend API URL

## Features

- Image upload and analysis
- AI-powered image recognition
- Category management
- Real-time analysis results
- Support for both local and cloud storage
- Responsive design

## Technologies Used

### Backend

- NestJS
- TypeScript
- MongoDB with Mongoose
- AWS Rekognition
- AWS S3 (optional)
- Jest for testing

### Frontend

- React
- TypeScript
- Redux Toolkit
- Vite
- CSS Modules
- Vitest for testing

## License

Marijuš Ladanovski
