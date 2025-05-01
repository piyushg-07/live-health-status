# server/Dockerfile

# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:23-slim AS builder
WORKDIR /usr/src/app

# Install all deps (including devDeps for the build)
COPY package*.json ./
RUN npm ci

# Copy source & compile TypeScript
COPY . .
RUN npm run build

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:23-slim AS runner
WORKDIR /usr/src/app

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts
COPY --from=builder /usr/src/app/dist ./dist

# Expose port and launch
EXPOSE 4000
CMD ["node", "dist/server.js"]
