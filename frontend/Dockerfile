# Stage 1: Build React app
# UPGRADE: Kita pakai Node 22 agar sesuai dengan syarat Vite v7
FROM node:22-alpine AS builder
WORKDIR /app

# Copy file package saja dulu untuk instalasi yang lebih cepat
COPY package*.json ./

# RUN: Bersihkan dan install ulang dependencies di lingkungan Linux Docker
RUN npm install

# Copy semua file kodingan terbaru
COPY . .

# 🔥 LANGKAH DEVOPS KRUSIAL: Tangkap argumen dari docker-compose SEBELUM proses compile!
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# RUN: Proses kompilasi Tailwind & Vite (Sekarang VITE_API_URL dijamin terbaca!)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Pastikan file nginx.conf ada di folder frontend kamu
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]