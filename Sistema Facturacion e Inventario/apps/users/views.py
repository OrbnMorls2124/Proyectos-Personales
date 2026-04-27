from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from apps.users.models import User
from apps.users.serializers import (
    UserSerializer, UserDetailSerializer, UserRegisterSerializer,
    UserChangePasswordSerializer
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Personalizamos la respuesta del JWT con información del usuario."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para obtener tokens JWT."""
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de usuarios.
    
    list: Obtener lista de usuarios
    create: Crear nuevo usuario (solo admin)
    retrieve: Obtener detalle de usuario
    update: Actualizar usuario
    partial_update: Actualizar parcialmente
    destroy: Eliminar usuario (solo admin)
    """
    
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        elif self.action == 'register':
            return UserRegisterSerializer
        return UserSerializer
    
    def get_permissions(self):
        """Permisos específicos por acción."""
        if self.action == 'register':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtra según el rol del usuario."""
        user = self.request.user
        if user.is_admin():
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Endpoint para registro de nuevos usuarios."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserDetailSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Endpoint para cambiar contraseña."""
        serializer = UserChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response(
            {'detail': 'Contraseña actualizada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtiene la información del usuario autenticado."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active_users(self, request):
        """Lista usuarios activos."""
        queryset = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_destroy(self, instance):
        """Solo permite eliminar si es admin."""
        if not self.request.user.is_admin():
            self.permission_denied(
                self.request,
                message='Solo administradores pueden eliminar usuarios'
            )
        instance.delete()
