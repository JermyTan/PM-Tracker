from django.contrib import admin

from pigeonhole.common.admin import BaseAdmin

from .models import (
    GoogleAuthentication,
    FacebookAuthentication,
    PasswordAuthentication,
)

# Register your models here.
admin.site.register(GoogleAuthentication, BaseAdmin)
admin.site.register(FacebookAuthentication, BaseAdmin)
admin.site.register(PasswordAuthentication, BaseAdmin)
