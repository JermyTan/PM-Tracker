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


class AccountType(models.TextChoices):
    ADMIN = "ADMIN"  ## can change other users' type
    EDUCATOR = "EDUCATOR"  ## can create new courses
    STANDARD = "STANDARD"


MAX_ACCOUNT_TYPE_LENGTH = max(map(len, AccountType))


class User(TimestampedModel):
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True)
    account_type = models.CharField(
        max_length=MAX_ACCOUNT_TYPE_LENGTH,
        choices=AccountType.choices,
        default=AccountType.STANDARD,
    )
    profile_image = models.OneToOneField(
        Image, null=True, blank=True, on_delete=models.SET_NULL
    )

    def __str__(self) -> str:
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