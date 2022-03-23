from django.db import models

from django_update_from_dict import UpdateFromDictMixin


class TimestampedModel(UpdateFromDictMixin, models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class MergeSerializersMixin:
    """Merges additional serializers"""

    def to_internal_value(self, data):
        assert hasattr(
            self.Meta, "merge_serializers"
        ), f'Class {self.__class__.__name__} missing "Meta.merge_serializers" attribute'

        obj = super(MergeSerializersMixin, self).to_internal_value(data)

        for serializer_class in self.Meta.merge_serializers:
            serializer = serializer_class(data=data)
            serializer.is_valid(raise_exception=True)

            obj.update(serializer.validated_data)

        return obj
