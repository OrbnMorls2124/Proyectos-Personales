from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventory.models import InventoryMovement, StockAlert
from apps.inventory.serializers import InventoryMovementSerializer, StockAlertSerializer


class InventoryMovementViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de movimientos de inventario.
    
    Acciones especiales:
    - by_product: Movimientos de un producto específico
    - by_movement_type: Movimientos por tipo (entrada/salida/ajuste)
    - recent: Últimos movimientos
    - by_reason: Movimientos por razón
    """
    
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product', 'movement_type', 'reason']
    search_fields = ['product__name', 'reference_number']
    ordering_fields = ['created_at', 'product']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Obtiene movimientos de un producto específico."""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'Debe especificar product_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movements = InventoryMovement.objects.filter(product_id=product_id)
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_movement_type(self, request):
        """Filtra movimientos por tipo."""
        movement_type = request.query_params.get('type')
        if not movement_type:
            return Response(
                {'error': 'Debe especificar type (in/out/adjustment)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movements = InventoryMovement.objects.filter(movement_type=movement_type)
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Retorna los últimos movimientos."""
        limit = request.query_params.get('limit', 20)
        try:
            limit = int(limit)
        except ValueError:
            limit = 20
        
        movements = InventoryMovement.objects.all()[:limit]
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_reason(self, request):
        """Filtra movimientos por razón."""
        reason = request.query_params.get('reason')
        if not reason:
            return Response(
                {'error': 'Debe especificar reason'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        movements = InventoryMovement.objects.filter(reason=reason)
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)


class StockAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para alertas de stock (solo lectura).
    
    Acciones especiales:
    - active: Alertas activas
    - resolved: Alertas resueltas
    - by_product: Alertas de un producto específico
    """
    
    queryset = StockAlert.objects.all()
    serializer_class = StockAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'product']
    ordering_fields = ['created_at', 'current_stock']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Retorna alertas activas."""
        alerts = StockAlert.objects.filter(status='active')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def resolved(self, request):
        """Retorna alertas resueltas."""
        alerts = StockAlert.objects.filter(status='resolved')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Retorna alertas de un producto."""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'Debe especificar product_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        alerts = StockAlert.objects.filter(product_id=product_id)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_resolved(self, request, pk=None):
        """Marca una alerta como resuelta."""
        from django.utils import timezone
        alert = self.get_object()
        alert.status = 'resolved'
        alert.resolved_at = timezone.now()
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
