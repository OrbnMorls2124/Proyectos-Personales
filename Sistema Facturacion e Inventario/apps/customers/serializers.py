from rest_framework import serializers
from apps.customers.models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    """Serializador para Clientes."""
    
    full_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'customer_type', 'id_number', 'email', 'phone',
            'mobile', 'city', 'state', 'full_address', 'credit_limit',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_full_address(self, obj):
        return obj.get_full_address()


class CustomerDetailSerializer(serializers.ModelSerializer):
    """Serializador detallado para Clientes."""
    
    full_address = serializers.SerializerMethodField()
    invoice_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'customer_type', 'id_number', 'email', 'phone',
            'mobile', 'address', 'city', 'state', 'postal_code',
            'full_address', 'credit_limit', 'payment_terms',
            'contact_person', 'contact_position', 'is_active',
            'notes', 'invoice_count', 'total_spent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_address(self, obj):
        return obj.get_full_address()
    
    def get_invoice_count(self, obj):
        return obj.invoices.count()
    
    def get_total_spent(self, obj):
        from django.db.models import Sum
        total = obj.invoices.filter(status='paid').aggregate(
            total=Sum('total')
        )['total']
        return total or 0
