from django.contrib import admin
from apps.reports.models import SalesReport, ProductReport


@admin.register(SalesReport)
class SalesReportAdmin(admin.ModelAdmin):
    """Configuración del Admin para Reportes de Ventas."""
    
    list_display = ('report_date', 'report_type', 'total_invoices', 'total_sales', 'generated_at')
    list_filter = ('report_type', 'report_date')
    search_fields = ('report_date',)
    readonly_fields = ('generated_at', 'generated_by')


@admin.register(ProductReport)
class ProductReportAdmin(admin.ModelAdmin):
    """Configuración del Admin para Reportes de Productos."""
    
    list_display = ('product_name', 'sku', 'total_sold', 'total_revenue', 'report_date')
    list_filter = ('report_date',)
    search_fields = ('product_name', 'sku')
    readonly_fields = ('generated_at',)
