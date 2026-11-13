# ==========================================
# Stage 1: Build React Vite Bundle
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for Vite environment variables
ARG VITE_API_URL=/api/v1
ARG VITE_BANK_SIM_URL=/api/v1
ARG VITE_GOOGLE_CLIENT_ID=784393382981-temgp6dgtrvecfad5lof5b9kssu4vcdk.apps.googleusercontent.com

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BANK_SIM_URL=$VITE_BANK_SIM_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve via Nginx Alpine
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy build artifacts and custom nginx configuration
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

