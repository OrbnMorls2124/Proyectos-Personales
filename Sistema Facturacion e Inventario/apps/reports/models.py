from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User


class SalesReport(models.Model):
    """Modelo para almacenar reportes de ventas generados."""
    
    REPORT_TYPE_DAILY = 'daily'
    REPORT_TYPE_WEEKLY = 'weekly'
    REPORT_TYPE_MONTHLY = 'monthly'
    
    REPORT_TYPE_CHOICES = [
        (REPORT_TYPE_DAILY, _('Diario')),
        (REPORT_TYPE_WEEKLY, _('Semanal')),
        (REPORT_TYPE_MONTHLY, _('Mensual')),
    ]
    
    report_type = models.CharField(
        max_length=20,
        choices=REPORT_TYPE_CHOICES,
        verbose_name=_('Tipo de Reporte')
    )
    
    report_date = models.DateField(verbose_name=_('Fecha del Reporte'))
    
    # Métricas
    total_invoices = models.PositiveIntegerField(default=0)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_invoice = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Auditoría
    generated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sales_reports',
        verbose_name=_('Generado por')
    )
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-report_date']
        verbose_name = _('Reporte de Ventas')
        verbose_name_plural = _('Reportes de Ventas')
        unique_together = ['report_type', 'report_date']
        indexes = [
            models.Index(fields=['report_date']),
            models.Index(fields=['report_type']),
        ]
    
    def __str__(self):
        return f"Reporte {self.get_report_type_display()} - {self.report_date}"


class ProductReport(models.Model):
    """Modelo para reportes de productos más vendidos."""
    
    report_date = models.DateField(verbose_name=_('Fecha del Reporte'))
    
    product_name = models.CharField(max_length=300, verbose_name=_('Producto'))
    sku = models.CharField(max_length=100, verbose_name=_('SKU'))
    
    total_sold = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Cantidad Vendida')
    )
    total_revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Ingresos Totales')
    )
    
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-total_revenue']
        verbose_name = _('Reporte de Producto')
        verbose_name_plural = _('Reportes de Productos')
        indexes = [
            models.Index(fields=['report_date']),
            models.Index(fields=['total_sold']),
        ]
    
    def __str__(self):
        return f"{self.product_name} - {self.total_sold} unidades"
