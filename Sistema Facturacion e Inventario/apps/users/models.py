from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _
from datetime import datetime


class UserManager(BaseUserManager):
    """Gestor personalizado para el modelo User."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Crea y guarda un usuario regular."""
        if not email:
            raise ValueError(_('El correo electrónico es obligatorio'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Crea y guarda un superusuario."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.ROLE_ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser debe tener is_staff=True'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser debe tener is_superuser=True'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modelo personalizado de Usuario."""
    
    ROLE_ADMIN = 'admin'
    ROLE_EMPLOYEE = 'employee'
    
    ROLE_CHOICES = [
        (ROLE_ADMIN, _('Administrador')),
        (ROLE_EMPLOYEE, _('Empleado')),
    ]
    
    email = models.EmailField(unique=True, max_length=255, verbose_name=_('Correo'))
    first_name = models.CharField(max_length=150, verbose_name=_('Nombre'))
    last_name = models.CharField(max_length=150, verbose_name=_('Apellido'))
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_EMPLOYEE,
        verbose_name=_('Rol')
    )
    
    is_active = models.BooleanField(default=True, verbose_name=_('Activo'))
    is_staff = models.BooleanField(default=False, verbose_name=_('Es Personal'))
    
    # Campos adicionales
    phone = models.CharField(max_length=20, blank=True, verbose_name=_('Teléfono'))
    address = models.TextField(blank=True, verbose_name=_('Dirección'))
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name=_('Avatar')
    )
    
    # Timestamps
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name=_('Fecha de Creación'))
    last_login = models.DateTimeField(null=True, blank=True, verbose_name=_('Último Acceso'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Actualizado'))
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        ordering = ['-date_joined']
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario."""
        return f"{self.first_name} {self.last_name}"
    
    def is_admin(self):
        """Verifica si el usuario es administrador."""
        return self.role == self.ROLE_ADMIN
    
    def is_employee(self):
        """Verifica si el usuario es empleado."""
        return self.role == self.ROLE_EMPLOYEE
