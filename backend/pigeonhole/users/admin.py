from django.contrib import admin

from pigeonhole.common.admin import BaseAdmin

from .models import User, UserInvite

# Register your models here.
admin.site.register(User, BaseAdmin)
admin.site.register(UserInvite, BaseAdmin)
