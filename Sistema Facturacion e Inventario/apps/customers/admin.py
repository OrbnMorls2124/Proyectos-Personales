from django.contrib import admin
from apps.customers.models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Configuración del Admin para Clientes."""
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'customer_type', 'id_number')
        }),
        ('Contacto', {
            'fields': ('email', 'phone', 'mobile')
        }),
        ('Dirección', {
            'fields': ('address', 'city', 'state', 'postal_code')
        }),
        ('Información Comercial', {
            'fields': ('credit_limit', 'payment_terms')
        }),
        ('Contacto de Referencia', {
            'fields': ('contact_person', 'contact_position'),
            'classes': ('collapse',)
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
    )
    
    list_display = ('name', 'id_number', 'customer_type', 'email', 'city', 'is_active')
    list_filter = ('customer_type', 'is_active', 'city', 'created_at')
    search_fields = ('name', 'id_number', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')
