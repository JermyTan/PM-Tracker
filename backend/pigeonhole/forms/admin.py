from django.contrib import admin

from pigeonhole.common.admin import BaseAdmin
from .models import Form

# Register your models here.
admin.site.register(Form, BaseAdmin)
