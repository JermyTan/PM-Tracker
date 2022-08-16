import os
import logging
from typing import Optional

from django.db import models
from django.db.models.signals import post_delete
from django.utils.crypto import get_random_string

from pigeonhole.common.validators import is_url
from pigeonhole.common.models import TimestampedModel

logger = logging.getLogger("main")

# IMAGEKIT_PRIVATE_KEY = os.getenv("IMAGEKIT_PRIVATE_KEY")
# IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY")
# IMAGEKIT_BASE_URL = os.getenv("IMAGEKIT_BASE_URL")

## TODO: setup imagekit account
imagekit = None

# imagekit = ImageKit(
#     private_key=IMAGEKIT_PRIVATE_KEY,
#     public_key=IMAGEKIT_PUBLIC_KEY,
#     url_endpoint=IMAGEKIT_BASE_URL,
# )

# Create your models here.
class Image(TimestampedModel):
    image_url = models.URLField(max_length=500)
    image_id = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return f"{self.image_url}"

    def copy(self):
        return self.__class__(
            image_url=self.image_url,
            image_id=self.image_id,
        )

    def delete_image_from_server(self):
        ## image does not exist on server
        if not self.image_id:
            return

        imagekit.delete_file(self.image_id)

    def upload_image_to_server(self, filename: Optional[str] = None):
        if not self.image_url or is_url(self.image_url):
            return

        image_name = filename if filename else get_random_string(length=20)
        _, image_file = self.image_url.split(":", 1)

        data = imagekit.upload(
            file=image_file,
            file_name=image_name,
        ).get("response", {})

        image_url = data.get("url", "")
        image_id = data.get("fileId", "")

        if not all((image_url, image_id)):
            logger.error(
                f"Invalid value received from image upload api: image_url: {image_url}, image_id: {image_id}"
            )
            raise ValueError(f"Error in image upload.")

        self.image_url = image_url
        self.image_id = image_id


def image_cleanup(sender, instance: Image, **kwargs):
    instance.delete_image_from_server()


## set up listener to delete image from server when an image object is deleted
post_delete.connect(
    image_cleanup,
    sender=Image,
    dispatch_uid="content_delivery_service.image.image_cleanup",
)
