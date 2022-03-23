from rest_framework import serializers


class NameSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=255)


class UserIdSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True, min_value=1)
