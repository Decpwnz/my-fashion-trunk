FROM node:18-alpine

WORKDIR /app

# Install AWS CLI using apk
RUN apk add --no-cache \
    aws-cli \
    python3

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"] 