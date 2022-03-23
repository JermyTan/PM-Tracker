from rest_framework import serializers

from .models import Form


class FormSerializer(serializers.ModelSerializer):
    form_field_data = serializers.ListField(
        required=True, child=serializers.JSONField(), allow_empty=True
    )

    class Meta:
        model = Form
        fields = ("name", "form_field_data")

    def validate_form_field_data(self, form_field_data):
        for field_data in form_field_data:
            if type(field_data) is not dict:
                raise serializers.ValidationError(
                    "List must contain only JSON objects."
                )

        return form_field_data
