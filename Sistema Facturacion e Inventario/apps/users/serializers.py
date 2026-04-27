from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializador para listar usuarios."""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializador detallado para un usuario."""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'address', 'avatar', 'is_active',
            'date_joined', 'updated_at'
        ]
        read_only_fields = ['id', 'date_joined', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializador para registro de nuevos usuarios."""
    
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'password', 'password_confirm', 'phone', 'address'
        ]
    
    def validate(self, data):
        """Valida que las contraseñas coincidan."""
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({
                'password': 'Las contraseñas no coinciden'
            })
        return data
    
    def create(self, validated_data):
        """Crea un nuevo usuario."""
        user = User.objects.create_user(**validated_data)
        return user


class UserChangePasswordSerializer(serializers.Serializer):
    """Serializador para cambiar contraseña."""
    
    old_password = serializers.CharField(
        write_only=True,
        required=True
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True
    )
    
    def validate(self, data):
        """Valida que las nuevas contraseñas coincidan."""
        if data['new_password'] != data.pop('new_password_confirm'):
            raise serializers.ValidationError({
                'new_password': 'Las contraseñas no coinciden'
            })
        return data
    
    def validate_old_password(self, value):
        """Valida que la contraseña antigua sea correcta."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                'La contraseña antigua es incorrecta'
            )
        return value
