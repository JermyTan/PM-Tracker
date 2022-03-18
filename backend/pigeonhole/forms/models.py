from django.db import models

from pigeonhole.common.utils import default_list
from pigeonhole.common.models import TimestampedModel
from users.models import User


# Create your models here.
class Form(TimestampedModel):
    name = models.CharField(max_length=255)
    form_field_data = models.JSONField(blank=True, default=default_list)

    def __str__(self) -> str:
        return f"{self.name}"
