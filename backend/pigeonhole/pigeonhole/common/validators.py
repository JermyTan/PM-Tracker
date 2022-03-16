import logging

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

logger = logging.getLogger("main")

validate_url = URLValidator()


def is_url(url: str) -> bool:
    try:
        validate_url(url)
        return True
    except ValidationError as e:
        logger.warning(e)
        return False
