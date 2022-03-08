from rest_framework.exceptions import NotFound, PermissionDenied

from pigeonhole.common.constants import MILESTONE
from users.models import User
from .logic import get_courses
from .models import Course, CourseMembership, CourseMilestone, Role


def check_course(view_method):
    def _arguments_wrapper(instance, request, course_id: int, *args, **kwargs):
        try:
            course = (
                get_courses(id=course_id)
                .select_related("owner__profile_image", "coursesettings")
                .get()
            )

        except Course.DoesNotExist as e:
            raise NotFound(detail="No course found.", code="no_course_found")

        return view_method(instance, request, course=course, *args, **kwargs)

    return _arguments_wrapper


def check_membership(*allowed_roles: Role):
    def _method_wrapper(view_method):
        def _arguments_wrapper(
            instance, request, requester: User, course: Course, *args, **kwargs
        ):
            try:
                requester_membership = course.coursemembership_set.get(user=requester)

            except CourseMembership.DoesNotExist as e:
                raise PermissionDenied()

            if requester_membership.role not in allowed_roles:
                raise PermissionDenied()

            ## need to override to prevent additional db hits when user/course is accessed
            requester_membership.user = requester
            requester_membership.course = course

            return view_method(
                instance,
                request,
                requester=requester,
                course=course,
                requester_membership=requester_membership,
                *args,
                **kwargs,
            )

        return _arguments_wrapper

    return _method_wrapper


def check_milestone(view_method):
    def _arguments_wrapper(
        instance, request, milestone_id: int, course: Course, *args, **kwargs
    ):
        try:
            milestone = course.coursemilestone_set.get(id=milestone_id)

        except CourseMilestone.DoesNotExist as e:
            raise NotFound(
                detail=f"No {course.coursesettings.milestone_alias or MILESTONE} found.",
                code="no_milestone_found",
            )

        return view_method(
            instance, request, course=course, milestone=milestone, *args, **kwargs
        )

    return _arguments_wrapper
