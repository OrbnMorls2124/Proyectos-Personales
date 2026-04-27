from django.contrib import admin
from apps.inventory.models import InventoryMovement, StockAlert


@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
    """Configuración del Admin para Movimientos de Inventario."""
    
    fieldsets = (
        ('Movimiento', {
            'fields': ('product', 'movement_type', 'quantity', 'reason')
        }),
        ('Referencias', {
            'fields': ('reference_number', 'notes')
        }),
        ('Auditoría', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ('product', 'movement_type', 'quantity', 'reason', 'created_at')
    list_filter = ('movement_type', 'reason', 'created_at')
    search_fields = ('product__name', 'reference_number')
    readonly_fields = ('created_at', 'created_by')


@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    """Configuración del Admin para Alertas de Stock."""
    
    list_display = ('product', 'current_stock', 'minimum_stock', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('product__name',)
    readonly_fields = ('created_at', 'resolved_at')
