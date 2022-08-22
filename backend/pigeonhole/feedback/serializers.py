from rest_framework import serializers


class PostFeedbackSerializer(serializers.Serializer):
    content = serializers.CharField(required=True, allow_blank=True)
