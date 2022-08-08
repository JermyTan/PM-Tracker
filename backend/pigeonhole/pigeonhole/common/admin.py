from django.contrib import admin
from django.db import models

from django_json_widget.widgets import JSONEditorWidget


class BaseAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "created_at", "updated_at")
    formfield_overrides = {
        models.JSONField: {"widget": JSONEditorWidget},
    }
