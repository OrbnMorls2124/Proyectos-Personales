from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.inventory.models import InventoryMovement, StockAlert
from apps.products.models import Product


@receiver(post_save, sender=InventoryMovement)
def create_stock_alert(sender, instance, created, **kwargs):
    """
    Crea una alerta de stock cuando el stock de un producto baja del mínimo.
    """
    if created:
        product = instance.product
        
        # Si el stock está bajo, crear alerta
        if product.stock <= product.minimum_stock:
            # Verificar si ya existe una alerta activa
            existing_alert = StockAlert.objects.filter(
                product=product,
                status='active'
            ).exists()
            
            if not existing_alert:
                StockAlert.objects.create(
                    product=product,
                    current_stock=product.stock,
                    minimum_stock=product.minimum_stock,
                    status='active'
                )


@receiver(post_save, sender=Product)
def check_stock_level(sender, instance, **kwargs):
    """
    Verifica el nivel de stock y crea/resuelve alertas automáticamente.
    """
    # Si el stock volvió a ser suficiente, resolver alertas
    if instance.stock > instance.minimum_stock:
        StockAlert.objects.filter(
            product=instance,
            status='active'
        ).update(status='resolved')
