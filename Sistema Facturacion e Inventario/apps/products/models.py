from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, DecimalValidator
from decimal import Decimal


class Category(models.Model):
    """Modelo para Categorías de Productos."""
    
    name = models.CharField(
        max_length=200,
        unique=True,
        verbose_name=_('Nombre de Categoría')
    )
    description = models.TextField(blank=True, verbose_name=_('Descripción'))
    is_active = models.BooleanField(default=True, verbose_name=_('Activa'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Categoría')
        verbose_name_plural = _('Categorías')
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Modelo para Productos."""
    
    # Información básica
    name = models.CharField(max_length=300, verbose_name=_('Nombre del Producto'))
    sku = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('Código SKU')
    )
    description = models.TextField(blank=True, verbose_name=_('Descripción'))
    
    # Clasificación
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('Categoría')
    )
    
    # Precios
    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('Precio de Compra')
    )
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('Precio de Venta')
    )
    
    # Stock
    stock = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Stock Disponible')
    )
    minimum_stock = models.PositiveIntegerField(
        default=10,
        verbose_name=_('Stock Mínimo')
    )
    
    # Medidas
    weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name=_('Peso (kg)')
    )
    dimensions = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Dimensiones')
    )
    
    # Imagen
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name=_('Imagen del Producto')
    )
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name=_('Activo'))
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Actualizado'))
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = _('Producto')
        verbose_name_plural = _('Productos')
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
            models.Index(fields=['stock']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    def is_low_stock(self):
        """Verifica si el stock está por debajo del mínimo."""
        return self.stock <= self.minimum_stock
    
    def get_profit_margin(self):
        """Calcula el margen de ganancia en porcentaje."""
        if self.purchase_price == 0:
            return 0
        profit = self.sale_price - self.purchase_price
        return (profit / self.purchase_price) * 100
    
    def get_stock_status(self):
        """Retorna el estado del stock."""
        if self.stock == 0:
            return 'out_of_stock'
        elif self.is_low_stock():
            return 'low_stock'
        return 'in_stock'
