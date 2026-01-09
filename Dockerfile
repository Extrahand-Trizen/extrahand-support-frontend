# Use Node.js 18 LTS Alpine image for smaller size
FROM node:18-alpine AS base

# Install security updates and necessary packages
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create app directory with proper permissions
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Build stage
FROM base AS builder
WORKDIR /app

# Accept build cache buster argument
ARG CACHE_BUST=1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# ✨ CRITICAL: Add cache buster to force fresh code copy
RUN echo "Cache bust: ${CACHE_BUST}" > /tmp/cache-bust.txt

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3004
ENV HOSTNAME="0.0.0.0"

# Note: The following environment variables should be set at runtime via CapRover:
# - NEXT_PUBLIC_API_URL
# - CHATBOT_API_URL

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy standalone build if available, otherwise copy .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Remove unnecessary files
RUN rm -rf \
    .git \
    .gitignore \
    .env.example \
    *.md \
    .dockerignore \
    Dockerfile \
    node_modules \
    package-lock.json \
    tsconfig.json \
    next.config.js \
    postcss.config.mjs \
    tailwind.config.ts

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3004

# ✅ HEALTH CHECK - Check localhost inside container
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3004/ || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
