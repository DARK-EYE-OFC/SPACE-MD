
FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --omit=dev --no-audit --no-fund

COPY . .

EXPOSE 10000

CMD ["node", "index.js"]

