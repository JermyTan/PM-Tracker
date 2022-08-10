from typing import Sequence, Iterable, Optional

from django.db.models import QuerySet
from django.db import transaction

from pigeonhole.common.exceptions import InternalServerError, BadRequest
from pigeonhole.common.constants import (
    NAME,
    EMAIL,
    PROFILE_IMAGE,
    ACCOUNT_TYPE,
    HAS_PASSWORD_AUTH,
    GOOGLE_AUTH,
    FACEBOOK_AUTH,
)
from pigeonhole.common.parsers import parse_datetime_to_ms_timestamp
from authentication.models import (
    PasswordAuthentication,
    GoogleAuthentication,
    FacebookAuthentication,
)
from content_delivery_service.models import Image
from pigeonhole.common.parsers import to_base_json
from .models import User, PatchUserAction


def user_to_json(user: User) -> dict:
    data = to_base_json(user)

    data |= {
        NAME: user.name,
        EMAIL: user.email,
        PROFILE_IMAGE: user.profile_image.image_url
        if user.profile_image is not None
        else None,
        ACCOUNT_TYPE: user.account_type,
    }

    return data


def requester_to_json(requester: User) -> dict:
    data = user_to_json(user=requester)

    data |= {
        ACCOUNT_TYPE: requester.account_type,
        HAS_PASSWORD_AUTH: hasattr(
            requester, PasswordAuthentication.get_related_name()
        ),
        GOOGLE_AUTH: {
            EMAIL: requester.googleauthentication.email,
            PROFILE_IMAGE: requester.googleauthentication.profile_image,
        }
        if hasattr(requester, GoogleAuthentication.get_related_name())
        else None,
        FACEBOOK_AUTH: {
            EMAIL: requester.facebookauthentication.email,
            PROFILE_IMAGE: requester.facebookauthentication.profile_image,
        }
        if hasattr(requester, FacebookAuthentication.get_related_name())
        else None,
    }

    return data


def get_users(*args, **kwargs) -> QuerySet[User]:
    return User.objects.filter(*args, **kwargs)