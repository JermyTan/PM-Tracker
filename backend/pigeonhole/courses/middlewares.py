from rest_framework.exceptions import NotFound, PermissionDenied

from users.models import User
from .logic import get_course_memberships, get_courses
from .models import Course, CourseMembership, Role


def check_course(view_method):
    def _arguments_wrapper(
        instance, request, requester: User, course_id: int, *args, **kwargs
    ):
        try:
            course = (
                get_courses(id=course_id).select_related("owner__profile_image").get()
            )

        except Course.DoesNotExist as e:
            raise NotFound(detail="No course found.", code="no_course_found")

        return view_method(
            instance, request, requester=requester, course=course, *args, **kwargs
        )

    return _arguments_wrapper


def check_membership(view_method):
    def _arguments_wrapper(
        instance, request, requester: User, course: Course, *args, **kwargs
    ):
        try:
            requester_membership = get_course_memberships(
                user=requester, course=course
            ).get()
            ## need to override to prevent additional db hits when user/course is accessed
            requester_membership.user = requester
            requester_membership.course = course

        except CourseMembership.DoesNotExist as e:
            raise PermissionDenied()

        return view_method(
            instance,
            request,
            requester=requester,
            course=course,
            requester_membership=requester_membership,
            *args,
            **kwargs
        )

    return _arguments_wrapper


def check_role_access(*allowed_roles: Role):
    def _method_wrapper(view_method):
        def _arguments_wrapper(
            instance,
            request,
            requester: User,
            course: Course,
            requester_membership: CourseMembership,
            *args,
            **kwargs
        ):
            if requester_membership.role not in allowed_roles:
                raise PermissionDenied()

            return view_method(
                instance,
                request,
                requester=requester,
                course=course,
                requester_membership=requester_membership,
                *args,
                **kwargs
            )

        return _arguments_wrapper

    return _method_wrapper
