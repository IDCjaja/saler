
FROM registry.cn-hangzhou.aliyuncs.com/skylark/saler-nginx:1.18.0-alpine
WORKDIR /usr/share/nginx/html/
COPY ./dist/ ./real_estates
EXPOSE 8080