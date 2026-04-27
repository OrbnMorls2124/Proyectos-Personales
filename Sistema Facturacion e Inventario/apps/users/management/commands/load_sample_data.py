from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product
from apps.customers.models import Customer
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Carga datos de ejemplo en la base de datos'
    
    def handle(self, *args, **options):
        self.stdout.write('Creando datos de ejemplo...')
        
        # Crear usuario administrador
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                email='admin@example.com',
                password='admin123456',
                first_name='Administrador',
                last_name='Sistema'
            )
            self.stdout.write(self.style.SUCCESS('✓ Usuario admin creado'))
        
        # Crear usuario empleado
        if not User.objects.filter(email='empleado@example.com').exists():
            User.objects.create_user(
                email='empleado@example.com',
                password='empleado123',
                first_name='Juan',
                last_name='Pérez',
                role='employee'
            )
            self.stdout.write(self.style.SUCCESS('✓ Usuario empleado creado'))
        
        # Crear categorías
        categories_data = [
            {'name': 'Electrónica', 'description': 'Productos electrónicos'},
            {'name': 'Ropa', 'description': 'Prendas de vestir'},
            {'name': 'Alimentos', 'description': 'Productos alimenticios'},
            {'name': 'Muebles', 'description': 'Muebles y decoración'},
            {'name': 'Servicios', 'description': 'Servicios profesionales'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(f'✓ Categoría "{cat_data["name"]}" creada')
        
        # Crear productos
        products_data = [
            {
                'name': 'Laptop HP 15"',
                'sku': 'LAP-HP-001',
                'description': 'Laptop HP 15 pulgadas, Intel i5',
                'category': 'Electrónica',
                'purchase_price': Decimal('500.00'),
                'sale_price': Decimal('799.99'),
                'stock': 50,
                'minimum_stock': 5,
            },
            {
                'name': 'Mouse inalámbrico',
                'sku': 'MOUSE-001',
                'description': 'Mouse inalámbrico USB',
                'category': 'Electrónica',
                'purchase_price': Decimal('5.00'),
                'sale_price': Decimal('12.99'),
                'stock': 200,
                'minimum_stock': 20,
            },
            {
                'name': 'Camiseta Polo',
                'sku': 'SHIRT-001',
                'description': 'Camiseta polo de algodón',
                'category': 'Ropa',
                'purchase_price': Decimal('8.00'),
                'sale_price': Decimal('19.99'),
                'stock': 100,
                'minimum_stock': 10,
            },
            {
                'name': 'Silla de Oficina',
                'sku': 'CHAIR-001',
                'description': 'Silla ergonómica de oficina',
                'category': 'Muebles',
                'purchase_price': Decimal('80.00'),
                'sale_price': Decimal('149.99'),
                'stock': 25,
                'minimum_stock': 3,
            },
            {
                'name': 'Café Premium 500g',
                'sku': 'COFFE-001',
                'description': 'Café gourmet importado',
                'category': 'Alimentos',
                'purchase_price': Decimal('6.00'),
                'sale_price': Decimal('14.99'),
                'stock': 150,
                'minimum_stock': 30,
            },
        ]
        
        for prod_data in products_data:
            category = categories[prod_data.pop('category')]
            _, created = Product.objects.get_or_create(
                sku=prod_data['sku'],
                defaults={**prod_data, 'category': category}
            )
            if created:
                self.stdout.write(f'✓ Producto "{prod_data["name"]}" creado')
        
        # Crear clientes
        customers_data = [
            {
                'name': 'Empresa ABC SA',
                'customer_type': 'business',
                'id_number': '900123456',
                'email': 'contacto@abc.com',
                'phone': '3001234567',
                'address': 'Calle 1 #100',
                'city': 'Bogotá',
                'state': 'Cundinamarca',
                'credit_limit': Decimal('5000.00'),
            },
            {
                'name': 'Carlos García López',
                'customer_type': 'individual',
                'id_number': '1234567890',
                'email': 'carlos@example.com',
                'phone': '3009876543',
                'address': 'Carrera 5 #200',
                'city': 'Medellín',
                'state': 'Antioquia',
                'credit_limit': Decimal('1000.00'),
            },
            {
                'name': 'Distribuidora del Centro',
                'customer_type': 'business',
                'id_number': '800456789',
                'email': 'ventas@distcentro.com',
                'phone': '6015551234',
                'address': 'Avenida Central #500',
                'city': 'Cali',
                'state': 'Valle del Cauca',
                'credit_limit': Decimal('10000.00'),
            },
        ]
        
        for cust_data in customers_data:
            _, created = Customer.objects.get_or_create(
                id_number=cust_data['id_number'],
                defaults=cust_data
            )
            if created:
                self.stdout.write(f'✓ Cliente "{cust_data["name"]}" creado')
        
        self.stdout.write(self.style.SUCCESS('\n✓ Datos de ejemplo cargados exitosamente'))
        self.stdout.write('\nCredenciales de prueba:')
        self.stdout.write('  Email: admin@example.com')
        self.stdout.write('  Password: admin123456')
        self.stdout.write('  Rol: Administrador')
        self.stdout.write('\n  Email: empleado@example.com')
        self.stdout.write('  Password: empleado123')
        self.stdout.write('  Rol: Empleado')
