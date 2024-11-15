FROM node:18-alpine

WORKDIR /app

# Add build arguments
ARG NODE_ENV
ARG MONGODB_URI
ARG AWS_REGION
ARG AWS_S3_BUCKET

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV MONGODB_URI=$MONGODB_URI
ENV AWS_REGION=$AWS_REGION
ENV AWS_S3_BUCKET=$AWS_S3_BUCKET

# Install AWS CLI
RUN apk add --no-cache \
    aws-cli \
    python3

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 