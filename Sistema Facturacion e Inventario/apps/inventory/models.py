from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from apps.products.models import Product
from apps.users.models import User


class InventoryMovement(models.Model):
    """Modelo para registrar movimientos de inventario."""
    
    MOVEMENT_TYPE_IN = 'in'
    MOVEMENT_TYPE_OUT = 'out'
    MOVEMENT_TYPE_ADJUSTMENT = 'adjustment'
    
    MOVEMENT_TYPE_CHOICES = [
        (MOVEMENT_TYPE_IN, _('Entrada')),
        (MOVEMENT_TYPE_OUT, _('Salida')),
        (MOVEMENT_TYPE_ADJUSTMENT, _('Ajuste')),
    ]
    
    REASON_PURCHASE = 'purchase'
    REASON_RETURN = 'return'
    REASON_SALE = 'sale'
    REASON_DAMAGE = 'damage'
    REASON_LOSS = 'loss'
    REASON_INVENTORY_COUNT = 'inventory_count'
    REASON_OTHER = 'other'
    
    REASON_CHOICES = [
        (REASON_PURCHASE, _('Compra')),
        (REASON_RETURN, _('Devolución')),
        (REASON_SALE, _('Venta')),
        (REASON_DAMAGE, _('Daño')),
        (REASON_LOSS, _('Pérdida')),
        (REASON_INVENTORY_COUNT, _('Conteo de Inventario')),
        (REASON_OTHER, _('Otro')),
    ]
    
    # Información del movimiento
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='inventory_movements',
        verbose_name=_('Producto')
    )
    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_TYPE_CHOICES,
        verbose_name=_('Tipo de Movimiento')
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name=_('Cantidad')
    )
    reason = models.CharField(
        max_length=50,
        choices=REASON_CHOICES,
        verbose_name=_('Razón')
    )
    
    # Referencias
    reference_number = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Número de Referencia')
    )
    notes = models.TextField(blank=True, verbose_name=_('Notas'))
    
    # Auditoría
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='inventory_movements',
        verbose_name=_('Creado por')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha'))
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Movimiento de Inventario')
        verbose_name_plural = _('Movimientos de Inventario')
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['movement_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.product} ({self.quantity})"
    
    def save(self, *args, **kwargs):
        """Actualiza el stock del producto al guardar el movimiento."""
        is_new = self.pk is None
        
        if is_new:
            if self.movement_type == self.MOVEMENT_TYPE_IN:
                self.product.stock += self.quantity
            elif self.movement_type == self.MOVEMENT_TYPE_OUT:
                self.product.stock -= self.quantity
            elif self.movement_type == self.MOVEMENT_TYPE_ADJUSTMENT:
                # Para ajustes, la cantidad es el nuevo valor
                self.product.stock = self.quantity
            
            self.product.save()
        
        super().save(*args, **kwargs)


class StockAlert(models.Model):
    """Modelo para alertas de stock bajo."""
    
    STATUS_ACTIVE = 'active'
    STATUS_RESOLVED = 'resolved'
    
    STATUS_CHOICES = [
        (STATUS_ACTIVE, _('Activa')),
        (STATUS_RESOLVED, _('Resuelta')),
    ]
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='stock_alerts',
        verbose_name=_('Producto')
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_ACTIVE,
        verbose_name=_('Estado')
    )
    current_stock = models.PositiveIntegerField(
        verbose_name=_('Stock Actual')
    )
    minimum_stock = models.PositiveIntegerField(
        verbose_name=_('Stock Mínimo')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Alerta de Stock')
        verbose_name_plural = _('Alertas de Stock')
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['product']),
        ]
    
    def __str__(self):
        return f"Alerta: {self.product.name} - Stock: {self.current_stock}"
