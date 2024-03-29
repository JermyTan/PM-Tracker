import logging

from django.db.models import Prefetch

from rest_framework.exceptions import NotFound, PermissionDenied

from pigeonhole.common.constants import MILESTONE
from users.models import User
from .logic import get_courses
from .models import (
    Course,
    CourseGroup,
    CourseGroupMember,
    CourseMembership,
    CourseMilestone,
    CourseMilestoneTemplate,
    CourseSubmission,
    CourseSubmissionComment,
    Role,
)

logger = logging.getLogger("main")


def check_course(view_method):
    def _arguments_wrapper(instance, request, course_id: int, *args, **kwargs):
        try:
            course = (
                get_courses(id=course_id)
                .select_related("owner__profile_image", "coursesettings")
                .get()
            )

        except Course.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No course found.")

        return view_method(instance, request, course=course, *args, **kwargs)

    return _arguments_wrapper


def check_requester_membership(*allowed_roles: Role):
    def _method_wrapper(view_method):
        def _arguments_wrapper(
            instance, request, requester: User, course: Course, *args, **kwargs
        ):
            try:
                requester_membership = course.coursemembership_set.get(user=requester)

            except CourseMembership.DoesNotExist as e:
                logger.warning(e)
                raise PermissionDenied()

            if requester_membership.role not in allowed_roles:
                raise PermissionDenied()

            requester_membership.user = requester

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
            logger.warning(e)
            raise NotFound(
                detail=f"No {course.coursesettings.milestone_alias or MILESTONE} found."
            )

        return view_method(
            instance, request, course=course, milestone=milestone, *args, **kwargs
        )

    return _arguments_wrapper


def check_membership(view_method):
    def _arguments_wrapper(
        instance, request, member_id: int, course: Course, *args, **kwargs
    ):
        try:
            membership = course.coursemembership_set.select_related(
                "user__profile_image"
            ).get(id=member_id)

        except CourseMembership.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No course member found.")

        return view_method(
            instance, request, course=course, membership=membership, *args, **kwargs
        )

    return _arguments_wrapper


def check_group(view_method):
    def _arguments_wrapper(
        instance, request, group_id: int, course: Course, *args, **kwargs
    ):
        try:
            group = course.coursegroup_set.prefetch_related(
                Prefetch(
                    lookup="coursegroupmember_set",
                    queryset=CourseGroupMember.objects.select_related(
                        "member__user__profile_image"
                    ),
                )
            ).get(id=group_id)

        except CourseGroup.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No group found.")

        return view_method(
            instance, request, course=course, group=group, *args, **kwargs
        )

    return _arguments_wrapper


def check_template(view_method):
    def _arguments_wrapper(
        instance, request, template_id: int, course: Course, *args, **kwargs
    ):
        try:
            template = course.coursemilestonetemplate_set.select_related("form").get(
                id=template_id
            )

        except CourseMilestoneTemplate.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No template found.")

        return view_method(
            instance, request, course=course, template=template, *args, **kwargs
        )

    return _arguments_wrapper


def check_submission(view_method):
    def _arguments_wrapper(
        instance, request, submission_id: int, course: Course, *args, **kwargs
    ):
        try:
            submission = course.coursesubmission_set.select_related(
                "milestone",
                "group",
                "template__form",
                "creator__user__profile_image",
                "editor__user__profile_image",
            ).get(id=submission_id)

        except CourseSubmission.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No submission found.")

        return view_method(
            instance, request, course=course, submission=submission, *args, **kwargs
        )

    return _arguments_wrapper


def check_submission_comment(view_method):
    def _arguments_wrapper(
        instance,
        request,
        submission: CourseSubmission,
        comment_id: int,
        *args,
        **kwargs,
    ):
        try:
            submission_comment = submission.coursesubmissioncomment_set.select_related(
                "comment__commenter__profile_image", "member"
            ).get(id=comment_id)

        except CourseSubmissionComment.DoesNotExist as e:
            logger.warning(e)
            raise NotFound(detail="No comment found.")

        return view_method(
            instance,
            request,
            submission=submission,
            submission_comment=submission_comment,
            *args,
            **kwargs,
        )

    return _arguments_wrapper
