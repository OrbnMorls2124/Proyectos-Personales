from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Sum, Q
from apps.billing.models import Invoice, InvoiceItem, Payment
from apps.billing.serializers import (
    InvoiceSerializer, InvoiceDetailSerializer, InvoiceCreateSerializer,
    PaymentSerializer
)


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de facturas.
    
    Filtros disponibles:
    - customer: ID de cliente
    - status: Estado de factura
    - search: Búsqueda por número de factura
    - ordering: Ordenar por campo
    
    Acciones especiales:
    - pending: Facturas pendientes de pago
    - overdue: Facturas vencidas
    - paid: Facturas pagadas
    - by_customer: Facturas de un cliente
    - monthly_sales: Ventas por mes
    - record_payment: Registrar pago
    - generate_pdf: Generar PDF
    - cancel: Cancelar factura
    """
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['customer', 'status']
    search_fields = ['invoice_number', 'customer__name']
    ordering_fields = ['invoice_date', 'total', 'status']
    ordering = ['-invoice_date']
    
    def get_serializer_class(self):
        """Usa diferentes serializers según la acción."""
        if self.action == 'create':
            return InvoiceCreateSerializer
        elif self.action == 'retrieve':
            return InvoiceDetailSerializer
        return InvoiceSerializer
    
    def get_queryset(self):
        """Retorna todas las facturas."""
        return Invoice.objects.all()
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Retorna facturas pendientes (no pagadas completamente)."""
        invoices = Invoice.objects.filter(
            Q(status='issued') | Q(status='partially_paid')
        )
        serializer = self.get_serializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Retorna facturas vencidas."""
        today = timezone.now().date()
        invoices = Invoice.objects.filter(
            due_date__lt=today,
            status__in=['issued', 'partially_paid']
        )
        serializer = self.get_serializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def paid(self, request):
        """Retorna facturas pagadas."""
        invoices = Invoice.objects.filter(status='paid')
        serializer = self.get_serializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_customer(self, request):
        """Retorna facturas de un cliente específico."""
        customer_id = request.query_params.get('customer_id')
        if not customer_id:
            return Response(
                {'error': 'Debe especificar customer_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoices = Invoice.objects.filter(customer_id=customer_id)
        serializer = self.get_serializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def monthly_sales(self, request):
        """Retorna ventas mensuales."""
        from django.db.models.functions import TruncMonth
        from django.db.models import Value
        
        monthly = Invoice.objects.filter(
            status='paid'
        ).annotate(
            month=TruncMonth('invoice_date')
        ).values('month').annotate(
            total=Sum('total'),
            count=Count('id')
        ).order_by('month')
        
        return Response(monthly)
    
    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        """Registra un pago para una factura."""
        invoice = self.get_object()
        serializer = PaymentSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        payment = serializer.save(invoice=invoice)
        
        # Actualizar estado de la factura
        invoice.paid_amount += payment.amount
        if invoice.paid_amount >= invoice.total:
            invoice.status = Invoice.STATUS_PAID
        elif invoice.paid_amount > 0:
            invoice.status = Invoice.STATUS_PARTIALLY_PAID
        invoice.save()
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        """Marca la factura como pagada."""
        invoice = self.get_object()
        invoice.mark_as_paid()
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancela una factura."""
        invoice = self.get_object()
        
        if invoice.status == Invoice.STATUS_PAID:
            return Response(
                {'error': 'No se puede cancelar una factura pagada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoice.status = Invoice.STATUS_CANCELLED
        invoice.save()
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        """Envía la factura por correo (implementar con Celery/Email)."""
        invoice = self.get_object()
        # TODO: Implementar envío de email
        return Response(
            {'detail': 'Funcionalidad de envío por email en desarrollo'}
        )


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para pagos (solo lectura).
    
    Acciones especiales:
    - by_invoice: Pagos de una factura
    - by_date_range: Pagos en rango de fechas
    """
    
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice', 'payment_method']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']
    
    @action(detail=False, methods=['get'])
    def by_invoice(self, request):
        """Retorna pagos de una factura."""
        invoice_id = request.query_params.get('invoice_id')
        if not invoice_id:
            return Response(
                {'error': 'Debe especificar invoice_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payments = Payment.objects.filter(invoice_id=invoice_id)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_date_range(self, request):
        """Retorna pagos en un rango de fechas."""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'Debe especificar start_date y end_date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            start = datetime.fromisoformat(start_date)
            end = datetime.fromisoformat(end_date)
            
            payments = Payment.objects.filter(
                payment_date__range=[start, end]
            )
            serializer = self.get_serializer(payments, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen de pagos."""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date and end_date:
            from datetime import datetime
            try:
                start = datetime.fromisoformat(start_date)
                end = datetime.fromisoformat(end_date)
                payments = Payment.objects.filter(
                    payment_date__range=[start, end]
                )
            except ValueError:
                return Response(
                    {'error': 'Formato de fecha inválido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            payments = Payment.objects.all()
        
        summary = {
            'total_payments': payments.count(),
            'total_amount': float(payments.aggregate(Sum('amount'))['amount__sum'] or 0),
            'by_method': {}
        }
        
        for method, label in Payment.PAYMENT_METHOD_CHOICES:
            amount = payments.filter(payment_method=method).aggregate(
                Sum('amount')
            )['amount__sum']
            summary['by_method'][label] = float(amount or 0)
        
        return Response(summary)


from django.db.models import Count
