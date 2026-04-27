from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class UserAuthenticationTests(TestCase):
    """Pruebas para autenticación de usuarios."""
    
    def setUp(self):
        """Configuración inicial para las pruebas."""
        self.client = APIClient()
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_user_registration(self):
        """Prueba el registro de un nuevo usuario."""
        response = self.client.post(
            '/api/v1/auth/users/register/',
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())
    
    def test_user_login(self):
        """Prueba el login de un usuario."""
        # Crear usuario
        User.objects.create_user(
            email='testuser@example.com',
            password='TestPassword123!',
            first_name='Test',
            last_name='User'
        )
        
        # Intentar login
        response = self.client.post(
            '/api/v1/auth/login/',
            {
                'email': 'testuser@example.com',
                'password': 'TestPassword123!'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_invalid_login(self):
        """Prueba login con credenciales inválidas."""
        response = self.client.post(
            '/api/v1/auth/login/',
            {
                'email': 'nonexistent@example.com',
                'password': 'WrongPassword'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProtectedEndpointTests(TestCase):
    """Pruebas para endpoints protegidos."""
    
    def setUp(self):
        """Configuración inicial."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='TestPassword123!',
            first_name='Test',
            last_name='User'
        )
    
    def test_unauthorized_access(self):
        """Prueba acceso sin autenticación."""
        response = self.client.get('/api/v1/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_authorized_access(self):
        """Prueba acceso con autenticación."""
        # Obtener token
        token_response = self.client.post(
            '/api/v1/auth/login/',
            {
                'email': 'testuser@example.com',
                'password': 'TestPassword123!'
            },
            format='json'
        )
        token = token_response.data['access']
        
        # Acceder endpoint protegido
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/v1/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
