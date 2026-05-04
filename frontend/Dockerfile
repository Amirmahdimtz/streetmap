# مرحله 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# کپی package.json و نصب وابستگی‌ها
COPY package*.json ./
RUN npm install

# کپی کل کد و build
COPY . .
RUN npm run build

# مرحله 2: سرو با Nginx
FROM nginx:alpine

# کپی فایل‌های build شده
COPY --from=build /app/dist /usr/share/nginx/html

# کپی تنظیمات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]