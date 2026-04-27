from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.reports.views import SalesReportViewSet, ProductReportViewSet

router = DefaultRouter()
router.register(r'sales', SalesReportViewSet, basename='sales-report')
router.register(r'products', ProductReportViewSet, basename='product-report')

urlpatterns = [
    path('', include(router.urls)),
]
