# Checklist de Producción

## Seguridad

- [ ] Cambiar `SECRET_KEY` en settings.py
  ```bash
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```

- [ ] Establecer `DEBUG = False`

- [ ] Configurar `ALLOWED_HOSTS` correctamente
  ```python
  ALLOWED_HOSTS = ['tudominio.com', 'www.tudominio.com']
  ```

- [ ] Usar HTTPS (SSL/TLS)
  ```python
  SECURE_SSL_REDIRECT = True
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  ```

- [ ] Configurar CORS apropiadamente
  ```python
  CORS_ALLOWED_ORIGINS = ['https://tudominio.com']
  ```

- [ ] Cambiar credenciales de base de datos
  - Usuario de PostgreSQL
  - Contraseña fuerte
  - Host remoto (no localhost)

- [ ] Usar variables de entorno para datos sensibles

- [ ] Configurar headers de seguridad
  ```python
  SECURE_HSTS_SECONDS = 31536000
  SECURE_HSTS_INCLUDE_SUBDOMAINS = True
  X_FRAME_OPTIONS = 'DENY'
  ```

- [ ] Habilitar CSRF protection

- [ ] Configurar límite de rate limiting para API

## Base de Datos

- [ ] Crear backup automatizado
  ```bash
  pg_dump -U usuario -h host -d database > backup.sql
  ```

- [ ] Configurar replicación/redundancia (si es posible)

- [ ] Crear índices en campos de búsqueda frecuente

- [ ] Optimizar queries lentas

- [ ] Monitorear tamaño de base de datos

## Performance

- [ ] Usar Redis para caché
  ```python
  CACHES = {
      'default': {
          'BACKEND': 'django_redis.cache.RedisCache',
          'LOCATION': 'redis://127.0.0.1:6379/1',
      }
  }
  ```

- [ ] Implementar paginación en todas las listas

- [ ] Comprimir respuestas (gzip)

- [ ] Usar CDN para archivos estáticos

- [ ] Implementar database query optimization

- [ ] Usar SELECT_RELATED y PREFETCH_RELATED en QuerySets

## Deployment

- [ ] Usar Gunicorn como servidor WSGI
  ```bash
  gunicorn config.wsgi:application --workers 4 --bind 0.0.0.0:8000
  ```

- [ ] Usar Nginx como proxy inverso

- [ ] Configurar systemd/supervisor para reinicio automático

- [ ] Ejecutar `python manage.py collectstatic --noinput`

- [ ] Ejecutar `python manage.py migrate` en producción

- [ ] Configurar variables de entorno (.env)

- [ ] Usar un gestor de logs (ELK, Sentry, etc)

## Monitoreo

- [ ] Configurar alertas de error
  ```python
  ADMINS = [('Admin', 'admin@example.com')]
  ```

- [ ] Integrar Sentry para error tracking
  ```bash
  pip install sentry-sdk
  ```

- [ ] Monitorear CPU, memoria, disco

- [ ] Monitorear tráfico API

- [ ] Configurar healthchecks

- [ ] Monitorear tiempos de respuesta

## Logs

- [ ] Configurar rotación de logs

- [ ] Usar nivel INFO en producción (no DEBUG)

- [ ] Enviar logs a servidor centralizado

- [ ] Configurar alertas para errores críticos

## Backup y Recuperación

- [ ] Realizar backup diario de base de datos

- [ ] Realizar backup de archivos subidos

- [ ] Probar procedimiento de recuperación

- [ ] Documentar procedimiento de restauración

- [ ] Almacenar backups en localización remota

## Auditoría

- [ ] Registrar todas las acciones de admin

- [ ] Registrar cambios sensibles

- [ ] Revisar logs regularmente

- [ ] Implementar 2FA para usuarios admin

## API

- [ ] Documentar endpoints en Swagger/OpenAPI

- [ ] Implementar versionado de API (/api/v1/, /api/v2/)

- [ ] Configurar rate limiting
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_THROTTLE_CLASSES': [
          'rest_framework.throttling.AnonRateThrottle',
          'rest_framework.throttling.UserRateThrottle'
      ],
      'DEFAULT_THROTTLE_RATES': {
          'anon': '100/hour',
          'user': '1000/hour'
      }
  }
  ```

- [ ] Implementar versionado de API en cabeceras

- [ ] Documentar cambios en changelog

## Testing

- [ ] Ejecutar todos los tests antes de deploy
  ```bash
  python manage.py test
  ```

- [ ] Tener cobertura de código > 80%
  ```bash
  coverage run --source='.' manage.py test
  coverage report
  ```

- [ ] Probar todos los endpoints en producción

- [ ] Realizar test de carga

- [ ] Test de penetración (si es crítico)

## Mantenimiento

- [ ] Actualizar dependencias regularmente
  ```bash
  pip list --outdated
  ```

- [ ] Mantener Django actualizado

- [ ] Parchar vulnerabilidades conocidas

- [ ] Revisar logs regularmente

- [ ] Revisar permisos y roles

- [ ] Hacer rotación de credenciales

## Documentación

- [ ] Documentar arquitectura del sistema

- [ ] Documentar procedimientos de deploy

- [ ] Documentar procedimientos de rollback

- [ ] Documentar endpoints de API

- [ ] Mantener README actualizado

- [ ] Documentar procesos de mantenimiento

## DNS y Certificados

- [ ] Configurar DNS correctamente

- [ ] Obtener certificado SSL (Let's Encrypt)

- [ ] Configurar auto-renovación de certificado

- [ ] Verificar que DNS resuelve correctamente

## Email

- [ ] Configurar servidor SMTP
  ```python
  EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
  EMAIL_HOST = 'smtp.gmail.com'
  EMAIL_PORT = 587
  EMAIL_USE_TLS = True
  ```

- [ ] Configurar From address correcto

- [ ] Probar envío de emails

- [ ] Configurar SPF, DKIM, DMARC

## Checklist Final

```bash
# Antes de hacer deploy a producción:

# 1. Ejecutar tests
python manage.py test

# 2. Verificar configuración
python manage.py check --deploy

# 3. Recopilar estáticos
python manage.py collectstatic --noinput

# 4. Hacer backup
pg_dump -U usuario -h host -d database > backup_$(date +%Y%m%d).sql

# 5. Deploy
git push production main

# 6. Migraciones
python manage.py migrate

# 7. Reiniciar servicios
sudo systemctl restart billing_system

# 8. Verificar que todo funciona
curl https://tudominio.com/api/docs/
```

## Recursos Adicionales

- [Django Security Documentation](https://docs.djangoproject.com/en/4.2/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Deployment Guide](https://docs.djangoproject.com/en/4.2/howto/deployment/)
