from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/customers/', include('apps.customers.urls')),
    path('api/v1/inventory/', include('apps.inventory.urls')),
    path('api/v1/billing/', include('apps.billing.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    
    # Documentación API (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Archivos estáticos y media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
