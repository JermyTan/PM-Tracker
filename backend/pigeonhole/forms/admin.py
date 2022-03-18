from django.contrib import admin
from django.db import models

from django_json_widget.widgets import JSONEditorWidget

from pigeonhole.common.admin import BaseAdmin
from .models import Form

# Register your models here.
class VenueAdmin(BaseAdmin):
    formfield_overrides = {
        models.JSONField: {"widget": JSONEditorWidget},
    }


admin.site.register(Form, VenueAdmin)
