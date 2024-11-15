FROM node:18-alpine

WORKDIR /app

# Install AWS CLI using apk
RUN apk add --no-cache \
    aws-cli \
    python3

# Install cross-env globally
RUN npm install -g cross-env

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy environment files
COPY .env.* ./

# Copy rest of the application
COPY . .

# Set NODE_ENV and run build
ENV NODE_ENV=local
RUN npm run build

EXPOSE 3000

# Start the application with environment variables
ENV NODE_ENV=local
CMD ["npm", "run", "start:local"] 