from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from datetime import timedelta
from apps.reports.models import SalesReport, ProductReport
from apps.reports.serializers import SalesReportSerializer, ProductReportSerializer
from apps.billing.models import Invoice, InvoiceItem


class SalesReportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para reportes de ventas.
    
    Acciones especiales:
    - daily_sales: Ventas del día
    - weekly_sales: Ventas de la semana
    - monthly_sales: Ventas del mes
    - generate_monthly: Generar reporte mensual
    - summary: Resumen general de ventas
    """
    
    queryset = SalesReport.objects.all()
    serializer_class = SalesReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-report_date']
    
    @action(detail=False, methods=['get'])
    def daily_sales(self, request):
        """Retorna ventas de hoy."""
        today = timezone.now().date()
        invoices = Invoice.objects.filter(
            invoice_date=today,
            status='paid'
        )
        
        total_sales = invoices.aggregate(Sum('total'))['total__sum'] or 0
        
        return Response({
            'date': today,
            'total_invoices': invoices.count(),
            'total_sales': float(total_sales),
            'average_invoice': float(
                invoices.aggregate(Sum('total'))['total__sum'] / invoices.count()
                if invoices.count() > 0 else 0
            )
        })
    
    @action(detail=False, methods=['get'])
    def weekly_sales(self, request):
        """Retorna ventas de la semana actual."""
        today = timezone.now().date()
        start_week = today - timedelta(days=today.weekday())
        
        invoices = Invoice.objects.filter(
            invoice_date__gte=start_week,
            status='paid'
        )
        
        total_sales = invoices.aggregate(Sum('total'))['total__sum'] or 0
        
        return Response({
            'week_start': start_week,
            'week_end': today,
            'total_invoices': invoices.count(),
            'total_sales': float(total_sales),
            'daily_breakdown': self._get_daily_breakdown(start_week, today)
        })
    
    @action(detail=False, methods=['get'])
    def monthly_sales(self, request):
        """Retorna ventas del mes actual."""
        today = timezone.now().date()
        start_month = today.replace(day=1)
        
        if today.month == 12:
            end_month = start_month.replace(year=today.year + 1, month=1)
        else:
            end_month = start_month.replace(month=today.month + 1)
        
        invoices = Invoice.objects.filter(
            invoice_date__gte=start_month,
            invoice_date__lt=end_month,
            status='paid'
        )
        
        total_sales = invoices.aggregate(Sum('total'))['total__sum'] or 0
        tax_total = invoices.aggregate(Sum('tax_amount'))['tax_amount__sum'] or 0
        
        return Response({
            'month': start_month.strftime('%B %Y'),
            'total_invoices': invoices.count(),
            'total_sales': float(total_sales),
            'total_tax': float(tax_total),
            'average_invoice': float(
                total_sales / invoices.count()
                if invoices.count() > 0 else 0
            )
        })
    
    @action(detail=False, methods=['post'])
    def generate_monthly(self, request):
        """Genera un reporte mensual."""
        month = request.data.get('month')
        year = request.data.get('year')
        
        if not month or not year:
            return Response(
                {'error': 'Debe especificar month y year'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import date
            start_date = date(int(year), int(month), 1)
            
            if int(month) == 12:
                end_date = date(int(year) + 1, 1, 1)
            else:
                end_date = date(int(year), int(month) + 1, 1)
            
            invoices = Invoice.objects.filter(
                invoice_date__gte=start_date,
                invoice_date__lt=end_date,
                status='paid'
            )
            
            total_sales = invoices.aggregate(Sum('total'))['total__sum'] or 0
            tax_total = invoices.aggregate(Sum('tax_amount'))['tax_amount__sum'] or 0
            
            report = SalesReport.objects.create(
                report_type=SalesReport.REPORT_TYPE_MONTHLY,
                report_date=start_date,
                total_invoices=invoices.count(),
                total_sales=total_sales,
                total_tax=tax_total,
                average_invoice=total_sales / invoices.count() if invoices.count() > 0 else 0,
                generated_by=request.user
            )
            
            serializer = self.get_serializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except (ValueError, TypeError):
            return Response(
                {'error': 'Formato de mes/año inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Retorna resumen general de ventas."""
        invoices = Invoice.objects.filter(status='paid')
        
        total_sales = invoices.aggregate(Sum('total'))['total__sum'] or 0
        total_tax = invoices.aggregate(Sum('tax_amount'))['tax_amount__sum'] or 0
        
        return Response({
            'total_invoices': invoices.count(),
            'total_sales': float(total_sales),
            'total_tax': float(total_tax),
            'average_invoice': float(
                total_sales / invoices.count()
                if invoices.count() > 0 else 0
            ),
            'by_status': {
                'draft': Invoice.objects.filter(status='draft').count(),
                'issued': Invoice.objects.filter(status='issued').count(),
                'paid': invoices.count(),
                'partially_paid': Invoice.objects.filter(status='partially_paid').count(),
                'cancelled': Invoice.objects.filter(status='cancelled').count(),
            }
        })
    
    def _get_daily_breakdown(self, start_date, end_date):
        """Retorna desglose diario de ventas."""
        daily_sales = Invoice.objects.filter(
            invoice_date__gte=start_date,
            invoice_date__lte=end_date,
            status='paid'
        ).annotate(
            date=TruncDate('invoice_date')
        ).values('date').annotate(
            total=Sum('total'),
            count=Count('id')
        ).order_by('date')
        
        return list(daily_sales)


class ProductReportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para reportes de productos.
    
    Acciones especiales:
    - top_sold: Productos más vendidos
    - top_revenue: Productos con más ingresos
    - by_period: Productos vendidos en período
    - category_breakdown: Desglose por categoría
    """
    
    queryset = ProductReport.objects.all()
    serializer_class = ProductReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-total_revenue']
    
    @action(detail=False, methods=['get'])
    def top_sold(self, request):
        """Retorna productos más vendidos."""
        limit = request.query_params.get('limit', 10)
        try:
            limit = int(limit)
        except ValueError:
            limit = 10
        
        top_products = InvoiceItem.objects.filter(
            invoice__status='paid'
        ).values(
            'product__name',
            'product__sku'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('quantity') * 
                         Count('product__sale_price')  # Simplificado
        ).order_by('-total_sold')[:limit]
        
        return Response(list(top_products))
    
    @action(detail=False, methods=['get'])
    def top_revenue(self, request):
        """Retorna productos que generaron más ingresos."""
        limit = request.query_params.get('limit', 10)
        try:
            limit = int(limit)
        except ValueError:
            limit = 10
        
        top_products = InvoiceItem.objects.filter(
            invoice__status='paid'
        ).values(
            'product__name',
            'product__sku'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('quantity') * Sum('unit_price')
        ).order_by('-total_revenue')[:limit]
        
        return Response(list(top_products))
    
    @action(detail=False, methods=['get'])
    def by_period(self, request):
        """Retorna productos vendidos en un período."""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'Debe especificar start_date y end_date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            start = datetime.fromisoformat(start_date).date()
            end = datetime.fromisoformat(end_date).date()
            
            products = InvoiceItem.objects.filter(
                invoice__invoice_date__range=[start, end],
                invoice__status='paid'
            ).values(
                'product__name',
                'product__sku'
            ).annotate(
                total_sold=Sum('quantity'),
                total_revenue=Sum('quantity') * Sum('unit_price')
            ).order_by('-total_revenue')
            
            return Response(list(products))
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def category_breakdown(self, request):
        """Retorna desglose de ventas por categoría."""
        breakdown = InvoiceItem.objects.filter(
            invoice__status='paid'
        ).values(
            'product__category__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('quantity') * Sum('unit_price'),
            product_count=Count('product', distinct=True)
        ).order_by('-total_revenue')
        
        return Response(list(breakdown))
