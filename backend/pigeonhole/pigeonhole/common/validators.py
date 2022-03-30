import logging
from typing import Any, Sequence

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

from rest_framework import serializers

logger = logging.getLogger("main")

validate_url = URLValidator()


def is_url(url: str) -> bool:
    try:
        validate_url(url)
        return True
    except ValidationError as e:
        logger.warning(e)
        return False


def all_objects(obj_list: Sequence[Any]) -> Sequence[dict]:
    for obj in obj_list:
        if not isinstance(obj, dict):
            raise serializers.ValidationError(
                "This field must contain only JSON objects."
            )
