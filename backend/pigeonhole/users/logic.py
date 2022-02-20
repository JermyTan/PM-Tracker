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
from .models import User, UserInvite, PatchUserAction


def user_to_json(user: User) -> dict:
    data = {
        ID: user.id,
        NAME: user.name,
        EMAIL: user.email,
        PROFILE_IMAGE: None
        if user.profile_image is None
        else user.profile_image.image_url,
        CREATED_AT: parse_datetime_to_ms_timestamp(user.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(user.updated_at),
    }

    return data


def requester_to_json(requester: User) -> dict:
    data = user_to_json(user=requester)

    data.update(
        {
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
    )

    return data


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
