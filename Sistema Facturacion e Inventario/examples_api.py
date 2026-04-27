"""
Ejemplos de uso de la API del Sistema de Facturación e Inventario
usando la librería requests de Python.
"""

import requests
import json
from datetime import date, timedelta

# Configuración
API_BASE_URL = "http://localhost:8000/api/v1"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123456"


class BillingSystemClient:
    """Cliente para interactuar con la API del sistema de facturación."""
    
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
        self.headers = {
            'Content-Type': 'application/json'
        }
    
    def login(self, email, password):
        """Autentica un usuario y obtiene el token JWT."""
        response = self.session.post(
            f"{self.base_url}/auth/login/",
            json={
                "email": email,
                "password": password
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data['access']
            self.headers['Authorization'] = f'Bearer {self.token}'
            print(f"✓ Login exitoso como {email}")
            return True
        else:
            print(f"✗ Error de login: {response.status_code}")
            return False
    
    def register_user(self, email, password, first_name, last_name):
        """Registra un nuevo usuario."""
        response = self.session.post(
            f"{self.base_url}/auth/users/register/",
            json={
                "email": email,
                "password": password,
                "password_confirm": password,
                "first_name": first_name,
                "last_name": last_name
            }
        )
        
        if response.status_code == 201:
            print(f"✓ Usuario {email} registrado exitosamente")
            return response.json()
        else:
            print(f"✗ Error al registrar usuario: {response.text}")
            return None
    
    def create_category(self, name, description=""):
        """Crea una categoría de productos."""
        response = self.session.post(
            f"{self.base_url}/products/categories/",
            headers=self.headers,
            json={
                "name": name,
                "description": description,
                "is_active": True
            }
        )
        
        if response.status_code == 201:
            print(f"✓ Categoría '{name}' creada")
            return response.json()
        else:
            print(f"✗ Error al crear categoría: {response.text}")
            return None
    
    def create_product(self, name, sku, category_id, purchase_price, 
                      sale_price, stock, minimum_stock):
        """Crea un nuevo producto."""
        response = self.session.post(
            f"{self.base_url}/products/products/",
            headers=self.headers,
            json={
                "name": name,
                "sku": sku,
                "category": category_id,
                "purchase_price": str(purchase_price),
                "sale_price": str(sale_price),
                "stock": stock,
                "minimum_stock": minimum_stock,
                "is_active": True
            }
        )
        
        if response.status_code == 201:
            print(f"✓ Producto '{name}' creado (SKU: {sku})")
            return response.json()
        else:
            print(f"✗ Error al crear producto: {response.text}")
            return None
    
    def create_customer(self, name, id_number, email, phone, 
                       address, city, state, customer_type="individual"):
        """Crea un nuevo cliente."""
        response = self.session.post(
            f"{self.base_url}/customers/customers/",
            headers=self.headers,
            json={
                "name": name,
                "customer_type": customer_type,
                "id_number": id_number,
                "email": email,
                "phone": phone,
                "address": address,
                "city": city,
                "state": state,
                "is_active": True
            }
        )
        
        if response.status_code == 201:
            print(f"✓ Cliente '{name}' creado")
            return response.json()
        else:
            print(f"✗ Error al crear cliente: {response.text}")
            return None
    
    def create_invoice(self, customer_id, items, tax_rate=19, 
                      discount_amount=0, due_days=30):
        """Crea una nueva factura."""
        due_date = (date.today() + timedelta(days=due_days)).isoformat()
        
        response = self.session.post(
            f"{self.base_url}/billing/invoices/",
            headers=self.headers,
            json={
                "customer": customer_id,
                "due_date": due_date,
                "tax_rate": tax_rate,
                "discount_amount": str(discount_amount),
                "payment_method": "transfer",
                "invoice_items": items
            }
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"✓ Factura '{data['invoice_number']}' creada")
            return data
        else:
            print(f"✗ Error al crear factura: {response.text}")
            return None
    
    def record_payment(self, invoice_id, amount, payment_method="transfer", reference=""):
        """Registra un pago para una factura."""
        response = self.session.post(
            f"{self.base_url}/billing/invoices/{invoice_id}/record_payment/",
            headers=self.headers,
            json={
                "amount": str(amount),
                "payment_method": payment_method,
                "reference": reference
            }
        )
        
        if response.status_code == 201:
            print(f"✓ Pago de ${amount} registrado en factura #{invoice_id}")
            return response.json()
        else:
            print(f"✗ Error al registrar pago: {response.text}")
            return None
    
    def get_daily_sales(self):
        """Obtiene las ventas del día."""
        response = self.session.get(
            f"{self.base_url}/reports/sales/daily_sales/",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Error al obtener ventas diarias: {response.text}")
            return None
    
    def get_top_products(self, limit=10):
        """Obtiene los productos más vendidos."""
        response = self.session.get(
            f"{self.base_url}/reports/products/top_sold/?limit={limit}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Error al obtener productos top: {response.text}")
            return None
    
    def get_low_stock_products(self):
        """Obtiene productos con stock bajo."""
        response = self.session.get(
            f"{self.base_url}/products/products/low_stock/",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"✗ Error al obtener productos con stock bajo: {response.text}")
            return None


# ============================================
# EJEMPLOS DE USO
# ============================================

def example_complete_workflow():
    """Ejemplo completo del flujo de facturación."""
    
    print("\n" + "="*50)
    print("EJEMPLO: FLUJO COMPLETO DE FACTURACIÓN")
    print("="*50 + "\n")
    
    client = BillingSystemClient()
    
    # 1. Login
    print("1. Autenticación:")
    client.login(ADMIN_EMAIL, ADMIN_PASSWORD)
    
    # 2. Crear categoría
    print("\n2. Crear categoría:")
    category = client.create_category("Electrónica", "Productos electrónicos")
    category_id = category['id']
    
    # 3. Crear productos
    print("\n3. Crear productos:")
    product1 = client.create_product(
        "Laptop HP",
        "LAP-HP-001",
        category_id,
        500.00,
        799.99,
        50,
        5
    )
    product1_id = product1['id']
    
    product2 = client.create_product(
        "Mouse inalámbrico",
        "MOUSE-001",
        category_id,
        5.00,
        12.99,
        200,
        20
    )
    product2_id = product2['id']
    
    # 4. Crear cliente
    print("\n4. Crear cliente:")
    customer = client.create_customer(
        "Empresa ABC SA",
        "900123456",
        "contacto@abc.com",
        "6015551234",
        "Calle 1 #100",
        "Bogotá",
        "Cundinamarca",
        "business"
    )
    customer_id = customer['id']
    
    # 5. Crear factura
    print("\n5. Crear factura:")
    items = [
        {
            "product": product1_id,
            "quantity": 2,
            "unit_price": "799.99",
            "discount_percent": 0
        },
        {
            "product": product2_id,
            "quantity": 5,
            "unit_price": "12.99",
            "discount_percent": 10
        }
    ]
    
    invoice = client.create_invoice(customer_id, items)
    invoice_id = invoice['id']
    
    print(f"   Total factura: ${invoice['total']}")
    print(f"   Impuesto: ${invoice['tax_amount']}")
    
    # 6. Registrar pago
    print("\n6. Registrar pago:")
    payment = client.record_payment(
        invoice_id,
        float(invoice['total']),
        "transfer",
        "Transf. 123456"
    )
    
    # 7. Obtener reportes
    print("\n7. Reportes:")
    daily_sales = client.get_daily_sales()
    if daily_sales:
        print(f"   Ventas hoy:")
        print(f"     - Total facturas: {daily_sales['total_invoices']}")
        print(f"     - Total ventas: ${daily_sales['total_sales']}")
    
    top_products = client.get_top_products(5)
    if top_products:
        print(f"\n   Productos más vendidos:")
        for product in top_products:
            print(f"     - {product.get('product__name')}: {product.get('total_sold')} unidades")
    
    print("\n" + "="*50)
    print("✓ Flujo completado exitosamente")
    print("="*50 + "\n")


def example_check_inventory():
    """Ejemplo: Verificar inventario."""
    
    print("\n" + "="*50)
    print("EJEMPLO: VERIFICAR INVENTARIO")
    print("="*50 + "\n")
    
    client = BillingSystemClient()
    client.login(ADMIN_EMAIL, ADMIN_PASSWORD)
    
    low_stock = client.get_low_stock_products()
    if low_stock:
        print("Productos con stock bajo:")
        for product in low_stock:
            print(f"  - {product['name']}")
            print(f"    Stock: {product['stock']}/{product['minimum_stock']}")
            print(f"    Margen: {product['profit_margin']}%\n")


if __name__ == "__main__":
    # Ejecutar ejemplos
    try:
        # Ejemplo 1: Flujo completo
        example_complete_workflow()
        
        # Ejemplo 2: Verificar inventario
        example_check_inventory()
        
    except Exception as e:
        print(f"Error: {e}")
        print("\nAsegúrate de que:")
        print("1. El servidor Django está ejecutándose (python manage.py runserver)")
        print("2. La base de datos está correctamente configurada")
        print("3. Los datos de ejemplo están cargados (python manage.py load_sample_data)")
