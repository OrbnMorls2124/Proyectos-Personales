from django.contrib import admin
from apps.products.models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Configuración del Admin para Categorías."""
    
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Configuración del Admin para Productos."""
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'sku', 'description', 'category', 'image')
        }),
        ('Precios', {
            'fields': ('purchase_price', 'sale_price')
        }),
        ('Stock', {
            'fields': ('stock', 'minimum_stock')
        }),
        ('Medidas', {
            'fields': ('weight', 'dimensions'),
            'classes': ('collapse',)
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ('name', 'sku', 'category', 'stock', 'sale_price', 'is_active')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'sku')
    readonly_fields = ('created_at', 'updated_at')
