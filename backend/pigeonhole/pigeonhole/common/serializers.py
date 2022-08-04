from rest_framework import serializers

from .validators import all_objects


class NameField(serializers.CharField):
    def __init__(self, **kwargs):
        if "max_length" not in kwargs:
            kwargs["max_length"] = 255

        super().__init__(**kwargs)


class NameSerializer(serializers.Serializer):
    name = NameField(required=True)


class IdField(serializers.IntegerField):
    def __init__(self, **kwargs):
        if "min_value" not in kwargs:
            kwargs["min_value"] = 1

        super().__init__(**kwargs)


class UserIdSerializer(serializers.Serializer):
    user_id = IdField(required=True)

class BatchUserIdSerializer(serializers.Serializer):
    user_ids = serializers.ListField(child=IdField(required=True))


class ObjectListField(serializers.ListField):
    child = serializers.JSONField()

    def __init__(self, **kwargs):
        kwargs["validators"] = kwargs.get("validators", []) + [all_objects]

        super().__init__(**kwargs)
