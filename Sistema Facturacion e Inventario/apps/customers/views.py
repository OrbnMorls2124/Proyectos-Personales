from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.customers.models import Customer
from apps.customers.serializers import CustomerSerializer, CustomerDetailSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de clientes.
    
    Filtros disponibles:
    - customer_type: Tipo de cliente (individual/business)
    - is_active: Estado activo/inactivo
    - search: Búsqueda por nombre, email o cédula
    - ordering: Ordenar por campo
    
    Acciones especiales:
    - active_customers: Clientes activos
    - by_type: Clientes por tipo
    - search_by_id: Buscar por cédula/NIT
    """
    
    queryset = Customer.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['customer_type', 'is_active']
    search_fields = ['name', 'email', 'id_number', 'phone']
    ordering_fields = ['name', 'created_at', 'credit_limit']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Usa serializer detallado para retrieve."""
        if self.action == 'retrieve':
            return CustomerDetailSerializer
        return CustomerSerializer
    
    @action(detail=False, methods=['get'])
    def active_customers(self, request):
        """Retorna clientes activos."""
        customers = Customer.objects.filter(is_active=True)
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Retorna clientes por tipo."""
        customer_type = request.query_params.get('type')
        if not customer_type:
            return Response(
                {'error': 'Debe especificar type (individual/business)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customers = Customer.objects.filter(customer_type=customer_type)
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search_by_id(self, request):
        """Busca un cliente por número de identificación."""
        id_number = request.query_params.get('id')
        if not id_number:
            return Response(
                {'error': 'Debe especificar el parámetro id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(id_number=id_number)
            serializer = self.get_serializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response(
                {'error': 'Cliente no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def invoices(self, request, pk=None):
        """Obtiene todas las facturas de un cliente."""
        customer = self.get_object()
        invoices = customer.invoices.all()
        
        from apps.billing.serializers import InvoiceSerializer
        serializer = InvoiceSerializer(invoices, many=True)
        return Response({
            'customer': CustomerDetailSerializer(customer).data,
            'invoices': serializer.data,
            'total_invoices': invoices.count()
        })
