FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www/html
RUN a2enmod rewrite && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
WORKDIR /var/www/html
