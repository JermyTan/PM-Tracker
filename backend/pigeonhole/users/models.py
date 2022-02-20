from django.db import models
from django.db.models.signals import post_delete

from pigeonhole.common.models import TimestampedModel
from content_delivery_service.models import Image

# Create your models here.
class PatchUserAction(models.TextChoices):
    PASSWORD = "PASSWORD"
    GOOGLE = "GOOGLE"
    FACEBOOK = "FACEBOOK"
    NAME = "NAME"
    PROFILE_IMAGE = "PROFILE_IMAGE"


class User(TimestampedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    profile_image = models.ForeignKey(
        Image, null=True, blank=True, on_delete=models.SET_NULL
    )

    def __str__(self):
        return f"{self.name} | {self.email}"


def user_cleanup(sender, instance: User, **kwargs):
    if not instance.profile_image:
        return

    instance.profile_image.delete()


## set up listener to delete profile image when a user is deleted
post_delete.connect(
    user_cleanup,
    sender=User,
    dispatch_uid="users.user.user_cleanup",
)


class UserInvite(TimestampedModel):
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.email}"
