FROM nginx:alpine
LABEL maintainer="lizelong lizelong@fuzhi.ai"

# 复制nginx配置
COPY  ./deploy/nginx/ /etc/nginx/
# 复制打包好的文件
COPY  ./dist/ /var/www/html/

EXPOSE 80
