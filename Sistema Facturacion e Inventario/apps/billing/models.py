from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal
from apps.users.models import User
from apps.customers.models import Customer
from apps.products.models import Product


class Invoice(models.Model):
    """Modelo para Facturas."""
    
    STATUS_DRAFT = 'draft'
    STATUS_ISSUED = 'issued'
    STATUS_PAID = 'paid'
    STATUS_PARTIALLY_PAID = 'partially_paid'
    STATUS_CANCELLED = 'cancelled'
    
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Borrador')),
        (STATUS_ISSUED, _('Emitida')),
        (STATUS_PAID, _('Pagada')),
        (STATUS_PARTIALLY_PAID, _('Parcialmente Pagada')),
        (STATUS_CANCELLED, _('Cancelada')),
    ]
    
    PAYMENT_METHOD_CASH = 'cash'
    PAYMENT_METHOD_CARD = 'card'
    PAYMENT_METHOD_TRANSFER = 'transfer'
    PAYMENT_METHOD_CREDIT = 'credit'
    
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_METHOD_CASH, _('Efectivo')),
        (PAYMENT_METHOD_CARD, _('Tarjeta')),
        (PAYMENT_METHOD_TRANSFER, _('Transferencia')),
        (PAYMENT_METHOD_CREDIT, _('Crédito')),
    ]
    
    # Números
    invoice_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_('Número de Factura')
    )
    
    # Relaciones
    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name='invoices',
        verbose_name=_('Cliente')
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='invoices_created',
        verbose_name=_('Creado por')
    )
    
    # Fechas
    invoice_date = models.DateField(auto_now_add=True, verbose_name=_('Fecha de Factura'))
    due_date = models.DateField(verbose_name=_('Fecha de Vencimiento'))
    
    # Montos
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Subtotal')
    )
    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=19,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name=_('Tasa de Impuesto (%)')
    )
    tax_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Impuesto')
    )
    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Descuento')
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Total')
    )
    
    # Pago
    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Monto Pagado')
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True,
        verbose_name=_('Método de Pago')
    )
    
    # Estado
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_DRAFT,
        verbose_name=_('Estado')
    )
    
    # Información adicional
    notes = models.TextField(blank=True, verbose_name=_('Notas'))
    internal_notes = models.TextField(blank=True, verbose_name=_('Notas Internas'))
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    issued_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-invoice_date']
        verbose_name = _('Factura')
        verbose_name_plural = _('Facturas')
        indexes = [
            models.Index(fields=['invoice_number']),
            models.Index(fields=['customer']),
            models.Index(fields=['status']),
            models.Index(fields=['invoice_date']),
        ]
    
    def __str__(self):
        return f"Factura {self.invoice_number} - {self.customer.name}"
    
    def calculate_totals(self):
        """Calcula automáticamente subtotal, impuestos y total."""
        self.subtotal = sum(
            item.get_subtotal() for item in self.invoice_items.all()
        )
        self.tax_amount = (self.subtotal * self.tax_rate) / Decimal('100')
        self.total = self.subtotal + self.tax_amount - self.discount_amount
    
    def get_remaining_balance(self):
        """Calcula el balance pendiente."""
        return self.total - self.paid_amount
    
    def is_overdue(self):
        """Verifica si la factura está vencida."""
        from django.utils import timezone
        return self.due_date < timezone.now().date() and self.status != self.STATUS_PAID
    
    def mark_as_paid(self, paid_amount=None):
        """Marca la factura como pagada."""
        if paid_amount is None:
            paid_amount = self.total
        
        self.paid_amount = paid_amount
        
        if self.paid_amount >= self.total:
            self.status = self.STATUS_PAID
        elif self.paid_amount > 0:
            self.status = self.STATUS_PARTIALLY_PAID
        
        self.save()


class InvoiceItem(models.Model):
    """Modelo para líneas de factura."""
    
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='invoice_items',
        verbose_name=_('Factura')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        verbose_name=_('Producto')
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name=_('Cantidad')
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name=_('Precio Unitario')
    )
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name=_('Descuento (%)')
    )
    
    class Meta:
        verbose_name = _('Línea de Factura')
        verbose_name_plural = _('Líneas de Factura')
        unique_together = ['invoice', 'product']
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    def get_subtotal(self):
        """Calcula el subtotal de la línea sin descuento."""
        return self.quantity * self.unit_price
    
    def get_discount_amount(self):
        """Calcula el monto del descuento."""
        subtotal = self.get_subtotal()
        return (subtotal * self.discount_percent) / Decimal('100')
    
    def get_total(self):
        """Calcula el total de la línea con descuento."""
        return self.get_subtotal() - self.get_discount_amount()


class Payment(models.Model):
    """Modelo para registrar pagos de facturas."""
    
    PAYMENT_METHOD_CASH = 'cash'
    PAYMENT_METHOD_CARD = 'card'
    PAYMENT_METHOD_TRANSFER = 'transfer'
    PAYMENT_METHOD_CHECK = 'check'
    
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_METHOD_CASH, _('Efectivo')),
        (PAYMENT_METHOD_CARD, _('Tarjeta')),
        (PAYMENT_METHOD_TRANSFER, _('Transferencia')),
        (PAYMENT_METHOD_CHECK, _('Cheque')),
    ]
    
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name=_('Factura')
    )
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_('Monto')
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        verbose_name=_('Método de Pago')
    )
    payment_date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Referencia')
    )
    notes = models.TextField(blank=True, verbose_name=_('Notas'))
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payments',
        verbose_name=_('Registrado por')
    )
    
    class Meta:
        ordering = ['-payment_date']
        verbose_name = _('Pago')
        verbose_name_plural = _('Pagos')
        indexes = [
            models.Index(fields=['invoice']),
            models.Index(fields=['payment_date']),
        ]
    
    def __str__(self):
        return f"Pago {self.invoice.invoice_number} - {self.amount}"
