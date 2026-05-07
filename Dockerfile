# ── Base Image ───────────────────────────────────────────────
FROM node:18-slim

# ── Install Nginx ─────────────────────────────────────────────
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ── Working Directory ─────────────────────────────────────────
WORKDIR /app

# ── Install Dependencies ──────────────────────────────────────
COPY server/package*.json ./
RUN npm install --production

# ── Copy Server Files ─────────────────────────────────────────
COPY server/ .

# ── Copy Nginx Config ─────────────────────────────────────────
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# ── Copy Start Script ─────────────────────────────────────────
COPY start.sh .
RUN chmod +x start.sh

# ── Expose Port 80 (Nginx) ────────────────────────────────────
EXPOSE 80

# ── Start Everything ──────────────────────────────────────────
CMD ["./start.sh"]