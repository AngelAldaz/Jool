# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package.json ./
COPY package-lock.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy rest of the app (excluding node_modules)
COPY . .

# Build Next.js app
RUN npm run build

# Remove devDependencies and cache (optional, for smaller image)
RUN npm prune --production && npm cache clean --force

# Expose port (default Next.js port)
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
