from rest_framework import serializers
from apps.products.models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializador para Categorías."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active']
        read_only_fields = ['id']


class ProductSerializer(serializers.ModelSerializer):
    """Serializador para Productos."""
    
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )
    profit_margin = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    is_low_stock = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'description', 'category', 'category_name',
            'purchase_price', 'sale_price', 'stock', 'minimum_stock',
            'weight', 'dimensions', 'image', 'is_active',
            'profit_margin', 'stock_status', 'is_low_stock',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_profit_margin(self, obj):
        return round(obj.get_profit_margin(), 2)
    
    def get_stock_status(self, obj):
        status_map = {
            'out_of_stock': 'Sin Stock',
            'low_stock': 'Stock Bajo',
            'in_stock': 'En Stock'
        }
        return status_map.get(obj.get_stock_status(), 'Desconocido')
    
    def get_is_low_stock(self, obj):
        return obj.is_low_stock()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializador detallado para Productos."""
    
    category_detail = CategorySerializer(source='category', read_only=True)
    profit_margin = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'description', 'category', 'category_detail',
            'purchase_price', 'sale_price', 'stock', 'minimum_stock',
            'weight', 'dimensions', 'image', 'is_active',
            'profit_margin', 'stock_status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_profit_margin(self, obj):
        return round(obj.get_profit_margin(), 2)
    
    def get_stock_status(self, obj):
        return obj.get_stock_status()
