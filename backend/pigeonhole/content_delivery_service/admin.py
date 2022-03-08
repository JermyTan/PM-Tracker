from django.contrib import admin

from pigeonhole.common.admin import BaseAdmin

from .models import Image

# Register your models here.
admin.site.register(Image, BaseAdmin)
