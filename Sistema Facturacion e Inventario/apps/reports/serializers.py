from rest_framework import serializers
from apps.reports.models import SalesReport, ProductReport


class SalesReportSerializer(serializers.ModelSerializer):
    """Serializador para Reportes de Ventas."""
    
    report_type_display = serializers.CharField(
        source='get_report_type_display',
        read_only=True
    )
    generated_by_name = serializers.CharField(
        source='generated_by.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = SalesReport
        fields = [
            'id', 'report_type', 'report_type_display', 'report_date',
            'total_invoices', 'total_sales', 'total_tax',
            'average_invoice', 'generated_by', 'generated_by_name',
            'generated_at'
        ]
        read_only_fields = ['id', 'generated_at']


class ProductReportSerializer(serializers.ModelSerializer):
    """Serializador para Reportes de Productos."""
    
    class Meta:
        model = ProductReport
        fields = [
            'id', 'report_date', 'product_name', 'sku',
            'total_sold', 'total_revenue', 'generated_at'
        ]
        read_only_fields = ['id', 'generated_at']
