from rest_framework import serializers
from apps.inventory.models import InventoryMovement, StockAlert


class InventoryMovementSerializer(serializers.ModelSerializer):
    """Serializador para Movimientos de Inventario."""
    
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    created_by_name = serializers.CharField(
        source='created_by.get_full_name',
        read_only=True
    )
    movement_type_display = serializers.CharField(
        source='get_movement_type_display',
        read_only=True
    )
    reason_display = serializers.CharField(
        source='get_reason_display',
        read_only=True
    )
    
    class Meta:
        model = InventoryMovement
        fields = [
            'id', 'product', 'product_name', 'movement_type', 'movement_type_display',
            'quantity', 'reason', 'reason_display', 'reference_number',
            'notes', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'created_by']
    
    def create(self, validated_data):
        """Asigna automáticamente el usuario que crea el movimiento."""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class StockAlertSerializer(serializers.ModelSerializer):
    """Serializador para Alertas de Stock."""
    
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = StockAlert
        fields = [
            'id', 'product', 'product_name', 'status', 'status_display',
            'current_stock', 'minimum_stock', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'created_at', 'resolved_at']
