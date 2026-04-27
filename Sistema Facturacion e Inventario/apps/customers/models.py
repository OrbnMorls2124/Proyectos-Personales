from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator, RegexValidator


class Customer(models.Model):
    """Modelo para Clientes."""
    
    CUSTOMER_TYPE_INDIVIDUAL = 'individual'
    CUSTOMER_TYPE_BUSINESS = 'business'
    
    CUSTOMER_TYPE_CHOICES = [
        (CUSTOMER_TYPE_INDIVIDUAL, _('Cliente Individual')),
        (CUSTOMER_TYPE_BUSINESS, _('Empresa')),
    ]
    
    # Información básica
    name = models.CharField(
        max_length=300,
        verbose_name=_('Nombre/Razón Social')
    )
    customer_type = models.CharField(
        max_length=20,
        choices=CUSTOMER_TYPE_CHOICES,
        default=CUSTOMER_TYPE_INDIVIDUAL,
        verbose_name=_('Tipo de Cliente')
    )
    
    # Identificación
    id_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_('Cédula/NIT')
    )
    
    # Contacto
    email = models.EmailField(
        verbose_name=_('Correo'),
        validators=[EmailValidator()]
    )
    phone = models.CharField(
        max_length=20,
        verbose_name=_('Teléfono'),
        validators=[RegexValidator(
            regex=r'^\+?[\d\s\-()]+$',
            message=_('Ingrese un teléfono válido')
        )]
    )
    mobile = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_('Celular')
    )
    
    # Dirección
    address = models.TextField(verbose_name=_('Dirección'))
    city = models.CharField(max_length=100, verbose_name=_('Ciudad'))
    state = models.CharField(max_length=100, verbose_name=_('Departamento'))
    postal_code = models.CharField(max_length=20, blank=True, verbose_name=_('Código Postal'))
    
    # Información comercial
    credit_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name=_('Límite de Crédito')
    )
    payment_terms = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Términos de Pago')
    )
    
    # Contacto de referencia (opcional)
    contact_person = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_('Persona de Contacto')
    )
    contact_position = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Cargo')
    )
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name=_('Activo'))
    notes = models.TextField(blank=True, verbose_name=_('Notas'))
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Actualizado'))
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Cliente')
        verbose_name_plural = _('Clientes')
        indexes = [
            models.Index(fields=['id_number']),
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.id_number})"
    
    def get_full_address(self):
        """Retorna la dirección completa formateada."""
        return f"{self.address}, {self.city}, {self.state}"
