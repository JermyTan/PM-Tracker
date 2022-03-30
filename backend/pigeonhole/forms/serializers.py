from rest_framework import serializers

from pigeonhole.common.serializers import ObjectListField

from .models import Form


class FormSerializer(serializers.ModelSerializer):
    form_field_data = ObjectListField(required=True)

    class Meta:
        model = Form
        fields = ("name", "form_field_data")
