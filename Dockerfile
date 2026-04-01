# ---- Stage 1: Build ----
# Install all deps (including devDeps) and build the Vite frontend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build the frontend
COPY . .
RUN npm run build

# ---- Stage 2: Production ----
# Only install production dependencies (tsx is now in dependencies)
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy the Vite-built frontend from builder
COPY --from=builder /app/dist ./dist
# Guarantee carrier logos are in dist/carrier-logos/ regardless of Vite copy behavior
COPY public/carrier-logos ./dist/carrier-logos

# Copy all server-side source files
COPY server.ts .
COPY tsconfig.json .
COPY api/ ./api/
COPY nowcerts-sync/ ./nowcerts-sync/
COPY services/ ./services/
COPY src/ ./src/
COPY data/ ./data/

ENV NODE_ENV=production
# PORT is injected by Cloud Run (defaults to 8080); server.ts reads process.env.PORT
EXPOSE 8080

# tsx is in dependencies so it's available here
CMD ["npx", "tsx", "server.ts"]
