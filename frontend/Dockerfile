FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 4000

RUN echo 'server { \
    listen 4000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf