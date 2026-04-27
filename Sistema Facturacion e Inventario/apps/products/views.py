from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.products.models import Product, Category
from apps.products.serializers import (
    ProductSerializer, ProductDetailSerializer, CategorySerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de categorías de productos.
    
    Permisos:
    - GET (list, retrieve): Cualquiera
    - POST, PUT, DELETE: Solo administrador
    """
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Permite lectura a todos, escritura solo a admin."""
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Solo admin puede crear."""
        if not self.request.user.is_admin():
            self.permission_denied(
                self.request,
                message='Solo administradores pueden crear categorías'
            )
        serializer.save()


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de productos.
    
    Filtros disponibles:
    - category: ID de categoría
    - is_active: Estado activo/inactivo
    - search: Búsqueda por nombre o SKU
    - ordering: Ordenar por campo
    
    Acciones especiales:
    - low_stock: Productos con stock bajo
    - out_of_stock: Productos sin stock
    - by_category: Productos por categoría
    """
    
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['name', 'sale_price', 'stock', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Usa serializer detallado para retrieve, el básico para otros."""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    def get_permissions(self):
        """Permisos según acción."""
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Valida que solo admin cree productos."""
        if not self.request.user.is_admin():
            self.permission_denied(
                self.request,
                message='Solo administradores pueden crear productos'
            )
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Retorna productos con stock bajo."""
        products = Product.objects.filter(
            stock__lte=models.F('minimum_stock'),
            is_active=True
        )
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Retorna productos sin stock."""
        products = Product.objects.filter(stock=0, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Retorna productos por categoría."""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {'error': 'Debe especificar category_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = Product.objects.filter(
            category_id=category_id,
            is_active=True
        )
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        """Ajusta el stock de un producto."""
        product = self.get_object()
        new_stock = request.data.get('stock')
        
        if new_stock is None:
            return Response(
                {'error': 'El campo stock es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_stock = int(new_stock)
            if new_stock < 0:
                raise ValueError('El stock no puede ser negativo')
            
            product.stock = new_stock
            product.save()
            
            return Response(
                {'detail': 'Stock ajustado correctamente'},
                status=status.HTTP_200_OK
            )
        except (ValueError, TypeError) as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


from django.db import models
