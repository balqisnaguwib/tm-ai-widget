# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set timezone to Malaysia
ENV TZ=Asia/Kuala_Lumpur

# Copy package files
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Build application with standalone output
RUN yarn build

# Production stage
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set timezone to Malaysia
ENV TZ=Asia/Kuala_Lumpur
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]