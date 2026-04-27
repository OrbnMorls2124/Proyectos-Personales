from django.apps import AppConfig


class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventory'
    verbose_name = 'Gestión de Inventario'
    
    def ready(self):
        """Registra los signals cuando la app está lista."""
        import apps.inventory.signals
