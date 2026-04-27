from rest_framework import serializers
from apps.billing.models import Invoice, InvoiceItem, Payment


class InvoiceItemSerializer(serializers.ModelSerializer):
    """Serializador para líneas de factura."""
    
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    sku = serializers.CharField(
        source='product.sku',
        read_only=True
    )
    subtotal = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'product', 'product_name', 'sku', 'quantity',
            'unit_price', 'discount_percent', 'subtotal',
            'discount_amount', 'total'
        ]
        read_only_fields = ['id']
    
    def get_subtotal(self, obj):
        return float(obj.get_subtotal())
    
    def get_discount_amount(self, obj):
        return float(obj.get_discount_amount())
    
    def get_total(self, obj):
        return float(obj.get_total())


class PaymentSerializer(serializers.ModelSerializer):
    """Serializador para Pagos."""
    
    created_by_name = serializers.CharField(
        source='created_by.get_full_name',
        read_only=True
    )
    payment_method_display = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )
    
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method', 'payment_method_display',
            'payment_date', 'reference', 'notes', 'created_by',
            'created_by_name'
        ]
        read_only_fields = ['id', 'payment_date', 'created_by']
    
    def create(self, validated_data):
        """Asigna automáticamente el usuario que registra el pago."""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializador para Facturas (lista)."""
    
    customer_name = serializers.CharField(
        source='customer.name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    remaining_balance = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name',
            'status', 'status_display', 'invoice_date', 'due_date',
            'subtotal', 'tax_amount', 'total', 'paid_amount',
            'remaining_balance', 'is_overdue', 'payment_method',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_remaining_balance(self, obj):
        return float(obj.get_remaining_balance())
    
    def get_is_overdue(self, obj):
        return obj.is_overdue()


class InvoiceDetailSerializer(serializers.ModelSerializer):
    """Serializador detallado para Facturas."""
    
    invoice_items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    customer_detail = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(
        source='created_by.get_full_name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    payment_method_display = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )
    remaining_balance = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer', 'customer_detail',
            'created_by', 'created_by_name',
            'invoice_date', 'due_date',
            'subtotal', 'tax_rate', 'tax_amount', 'discount_amount',
            'total', 'paid_amount', 'remaining_balance',
            'status', 'status_display', 'payment_method',
            'payment_method_display',
            'notes', 'internal_notes', 'is_overdue',
            'invoice_items', 'payments',
            'created_at', 'updated_at', 'issued_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'issued_at'
        ]
    
    def get_customer_detail(self, obj):
        from apps.customers.serializers import CustomerSerializer
        return CustomerSerializer(obj.customer).data
    
    def get_remaining_balance(self, obj):
        return float(obj.get_remaining_balance())
    
    def get_is_overdue(self, obj):
        return obj.is_overdue()


class InvoiceCreateSerializer(serializers.ModelSerializer):
    """Serializador para crear facturas."""
    
    invoice_items = InvoiceItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'customer', 'invoice_date', 'due_date',
            'tax_rate', 'discount_amount', 'payment_method',
            'notes', 'internal_notes', 'invoice_items'
        ]
    
    def create(self, validated_data):
        """Crea una factura con sus líneas."""
        items_data = validated_data.pop('invoice_items', [])
        
        # Asignar usuario que crea la factura
        validated_data['created_by'] = self.context['request'].user
        
        # Generar número de factura
        from django.utils import timezone
        last_invoice = Invoice.objects.order_by('-id').first()
        invoice_number = f"INV-{timezone.now().year}-{(last_invoice.id or 0) + 1:06d}"
        validated_data['invoice_number'] = invoice_number
        
        invoice = Invoice.objects.create(**validated_data)
        
        # Crear líneas de factura
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        
        # Calcular totales
        invoice.calculate_totals()
        invoice.save()
        
        return invoice
