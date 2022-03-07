from typing import Sequence, Iterable, Optional

from django.db.models import QuerySet
from django.db import transaction

from pigeonhole.common.exceptions import InternalServerError, BadRequest
from pigeonhole.common.constants import (
    ID,
    NAME,
    EMAIL,
    CREATED_AT,
    UPDATED_AT,
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
from .models import User, UserInvite, PatchUserAction


def user_to_json(user: User, extra: dict = {}) -> dict:
    data = to_base_json(user)

    data.update(
        {
            NAME: user.name,
            EMAIL: user.email,
            PROFILE_IMAGE: None
            if user.profile_image is None
            else user.profile_image.image_url,
        }
    )

    data.update(extra)

    return data


def requester_to_json(requester: User) -> dict:
    return user_to_json(
        user=requester,
        extra={
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
        },
    )


def user_invite_to_json(user_invite: UserInvite) -> dict:
    return {
        ID: user_invite.id,
        EMAIL: user_invite.email,
        CREATED_AT: parse_datetime_to_ms_timestamp(user_invite.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(user_invite.updated_at),
    }


def get_users(*args, **kwargs) -> QuerySet[User]:
    return User.objects.filter(*args, **kwargs)


def get_user_invites(*args, **kwargs) -> QuerySet[UserInvite]:
    return UserInvite.objects.filter(*args, **kwargs)
