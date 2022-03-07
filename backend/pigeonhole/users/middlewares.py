from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

from .models import User, AccountType
from .logic import get_users


def check_access(*allowed_account_types: AccountType):
    def _method_wrapper(view_method):
        def _arguments_wrapper(instance, request, *args, **kwargs):
            requester_id = request.user.id

            try:
                requester = (
                    get_users(id=requester_id).select_related("profile_image").get()
                )

            except User.DoesNotExist as e:
                raise AuthenticationFailed(
                    detail="Invalid user.",
                    code="invalid_user",
                )

            if requester.account_type not in allowed_account_types:
                raise PermissionDenied()

            return view_method(instance, request, requester=requester, *args, **kwargs)

        return _arguments_wrapper

    return _method_wrapper
