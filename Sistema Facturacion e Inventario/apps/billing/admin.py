from django.contrib import admin
from apps.billing.models import Invoice, InvoiceItem, Payment


class InvoiceItemInline(admin.TabularInline):
    """Inline para líneas de factura."""
    model = InvoiceItem
    extra = 1
    fields = ('product', 'quantity', 'unit_price', 'discount_percent')


class PaymentInline(admin.TabularInline):
    """Inline para pagos."""
    model = Payment
    extra = 0
    fields = ('amount', 'payment_method', 'reference', 'payment_date')
    readonly_fields = ('payment_date',)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    """Configuración del Admin para Facturas."""
    
    fieldsets = (
        ('Información General', {
            'fields': ('invoice_number', 'customer', 'created_by', 'status')
        }),
        ('Fechas', {
            'fields': ('invoice_date', 'due_date', 'issued_at')
        }),
        ('Montos', {
            'fields': ('subtotal', 'tax_rate', 'tax_amount', 'discount_amount', 'total')
        }),
        ('Pago', {
            'fields': ('paid_amount', 'payment_method')
        }),
        ('Notas', {
            'fields': ('notes', 'internal_notes'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [InvoiceItemInline, PaymentInline]
    list_display = ('invoice_number', 'customer', 'invoice_date', 'total', 'status', 'paid_amount')
    list_filter = ('status', 'invoice_date', 'payment_method')
    search_fields = ('invoice_number', 'customer__name')
    readonly_fields = ('subtotal', 'tax_amount', 'total', 'created_at', 'updated_at', 'issued_at')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Configuración del Admin para Pagos."""
    
    list_display = ('invoice', 'amount', 'payment_method', 'payment_date', 'created_by')
    list_filter = ('payment_method', 'payment_date')
    search_fields = ('invoice__invoice_number', 'reference')
    readonly_fields = ('payment_date',)
