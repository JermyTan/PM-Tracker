from django.contrib import admin


class BaseAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "created_at", "updated_at")
