from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.inventory.views import InventoryMovementViewSet, StockAlertViewSet

router = DefaultRouter()
router.register(r'movements', InventoryMovementViewSet, basename='inventory-movement')
router.register(r'alerts', StockAlertViewSet, basename='stock-alert')

urlpatterns = [
    path('', include(router.urls)),
]
