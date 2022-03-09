import os
import requests

from rest_framework import serializers, exceptions

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings


from pigeonhole.common.constants import (
    NAME,
    EMAIL,
    REFRESH,
    TOKEN_ID,
    ACCESS_TOKEN,
    PASSWORD,
    USER,
    TOKENS,
)
from pigeonhole.common.exceptions import InternalServerError, BadRequest
from users.models import User, UserInvite
from users.logic import requester_to_json, get_users, get_user_invites

## from email_service.logic import send_password_reset_email
from .logic import get_authenticated_data, reset_password

from .models import (
    AuthenticationData,
    GoogleAuthenticationData,
    FacebookAuthenticationData,
    PasswordAuthenticationData,
)


class GoogleAuthenticationSerializer(serializers.Serializer):
    token_id = serializers.CharField(required=True)

    def validate(self, data):
        token_id = data[TOKEN_ID]

        params = {"id_token": token_id}

        response = requests.get(
            url="https://oauth2.googleapis.com/tokeninfo",
            params=params,
        )
        response_data = response.json()

        name = response_data.get("name", "")
        email = response_data.get("email", "")
        auth_id = response_data.get("sub", "")

        if not all((name, email, auth_id)):
            raise BadRequest(
                detail="Invalid google token.",
                code="fail_google_token_verification",
            )

        auth_data = GoogleAuthenticationData(
            name=name,
            email=email,
            auth_id=auth_id,
            profile_image=response_data.get("picture", ""),
        )

        return auth_data


FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")
VALID_SCOPES = {"email", "public_profile"}


class FacebookAuthenticationSerializer(serializers.Serializer):
    access_token = serializers.CharField(required=True)

    def verify_access_token(self, access_token: str):
        params = {
            "input_token": access_token,
            "access_token": f"{FACEBOOK_APP_ID}|{FACEBOOK_APP_SECRET}",
        }

        response = requests.get(
            url="https://graph.facebook.com/v11.0/debug_token",
            params=params,
        )

        response_data = response.json()

        data = response_data.get("data")

        if data is None:
            try:
                error_message = response_data.get("error").get("message")

                if not error_message:
                    raise Exception()
            except Exception as e:
                raise BadRequest(
                    detail="Invalid facebook token.",
                    code="fail_facebook_token_verification",
                )

            raise InternalServerError(
                detail=error_message, code="fail_facebook_token_verification"
            )

        app_id = data.get("app_id")
        is_valid = data.get("is_valid")
        scopes = set(data.get("scopes", []))

        if app_id != FACEBOOK_APP_ID or not is_valid or scopes != VALID_SCOPES:
            raise BadRequest(
                detail="Invalid facebook token.",
                code="fail_facebook_token_verification",
            )

    def validate(self, data):
        access_token = data[ACCESS_TOKEN]

        self.verify_access_token(access_token)

        params = {
            "fields": "id,name,email,picture.width(512).height(512)",
            "access_token": access_token,
        }

        response = requests.get(
            url="https://graph.facebook.com/v11.0/me",
            params=params,
        )
        response_data = response.json()

        name = response_data.get("name", "")
        email = response_data.get("email", "")
        auth_id = response_data.get("id", "")

        if not all((name, email, auth_id)):
            raise BadRequest(
                detail="Invalid facebook token.",
                code="fail_facebook_token_verification",
            )

        try:
            profile_image = response_data.get("picture").get("data").get("url", "")
        except Exception as e:
            profile_image = ""

        auth_data = FacebookAuthenticationData(
            name=name,
            email=email,
            auth_id=auth_id,
            profile_image=profile_image,
        )

        return auth_data


class PasswordAuthenticationSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)

    def validate(self, data):
        password = data[PASSWORD]

        auth_data = PasswordAuthenticationData(
            name="",
            email="",
            auth_id=password,
        )

        return auth_data


class BaseAuthenticationSerializer(serializers.Serializer):
    default_error_messages = {"invalid_user": "Invalid user."}

    def raise_invalid_user(self):
        authentication_failed_exception = exceptions.AuthenticationFailed(
            detail=self.error_messages.get("invalid_user"),
            code="invalid_user",
        )
        raise authentication_failed_exception

    def authenticate(self, auth_data: AuthenticationData) -> dict:
        authenticated_user = auth_data.authenticate()

        if authenticated_user is None:
            self.raise_invalid_user()

        return get_authenticated_data(user=authenticated_user)


class GoogleLoginSerializer(
    GoogleAuthenticationSerializer, BaseAuthenticationSerializer
):
    def validate(self, data):
        try:
            auth_data = super().validate(data)
        except BadRequest as e:
            self.raise_invalid_user()

        return self.authenticate(auth_data)


class FacebookLoginSerializer(
    FacebookAuthenticationSerializer, BaseAuthenticationSerializer
):
    def validate(self, data):
        try:
            auth_data = super().validate(data)
        except BadRequest as e:
            self.raise_invalid_user()

        return self.authenticate(auth_data)


class PasswordLoginSerializer(
    PasswordAuthenticationSerializer, BaseAuthenticationSerializer
):
    ## TODO: to update once login process is finalized
    name = serializers.CharField(required=False, default="New user")
    email = serializers.EmailField(required=True)

    def validate(self, data):
        name = data[NAME]
        email = data[EMAIL]

        auth_data = super().validate(data)
        auth_data.name = name
        auth_data.email = email

        return self.authenticate(auth_data)


class AccessTokenRefreshSerializer(
    TokenRefreshSerializer,
    BaseAuthenticationSerializer,
):
    def validate(self, data):
        tokens = super().validate(data)

        user_id = RefreshToken(tokens[REFRESH]).get(key=api_settings.USER_ID_CLAIM)

        try:
            user = (
                get_users(id=user_id)
                .select_related(
                    "profile_image",
                    "passwordauthentication",
                    "googleauthentication",
                    "facebookauthentication",
                )
                .get()
            )
        except User.DoesNotExist as e:
            self.raise_invalid_user()

        data = requester_to_json(user)

        return {USER: data, TOKENS: tokens}


class CheckAccountSerializer(BaseAuthenticationSerializer):
    email = serializers.EmailField(required=True)

    def validate(self, data):
        email = data[EMAIL]

        try:
            user = get_users(email=email).get()
            return {EMAIL: user.email, NAME: user.name}
        except User.DoesNotExist as e:
            pass

        try:
            user_invite = get_user_invites(email=email).get()
            return {EMAIL: user_invite.email}
        except UserInvite.DoesNotExist as e:
            pass

        self.raise_invalid_user()


class PasswordResetSerializer(BaseAuthenticationSerializer):
    email = serializers.EmailField(required=True)

    def validate(self, data):
        email = data[EMAIL]

        try:
            user = get_users(email=email).get()
        except User.DoesNotExist as e:
            self.raise_invalid_user()

        new_password = reset_password(user=user)

        if new_password is None:
            raise InternalServerError(
                detail="An error has occurred while resetting the password.",
                code="fail_to_reset_password",
            )

        ## send_password_reset_email(user=user, new_password=new_password)

        return {EMAIL: user.email, NAME: user.name}
