import logging
from typing import Optional
from datetime import datetime

from django.db.models import QuerySet, Prefetch
from django.db import transaction

from pigeonhole.common.constants import (
    NAME,
    OWNER,
    DESCRIPTION,
    IS_PUBLISHED,
    SHOW_GROUP_MEMBERS_NAMES,
    ALLOW_MEMBERS_TO_CREATE_GROUPS,
    ALLOW_MEMBERS_TO_DELETE_GROUPS,
    ALLOW_MEMBERS_TO_JOIN_GROUPS,
    ALLOW_MEMBERS_TO_LEAVE_GROUPS,
    ALLOW_MEMBERS_TO_MODIFY_GROUP_NAME,
    ALLOW_MEMBERS_TO_ADD_OR_REMOVE_GROUP_MEMBERS,
    MILESTONE_ALIAS,
    START_DATE_TIME,
    END_DATE_TIME,
    ROLE,
    USER,
    MEMBER_COUNT,
    MEMBERS,
)
from pigeonhole.common.parsers import to_base_json, parse_datetime_to_ms_timestamp
from pigeonhole.common.exceptions import BadRequest
from users.models import User
from users.logic import user_to_json

from .models import (
    Course,
    CourseGroup,
    CourseGroupMember,
    CourseMembership,
    CourseMilestone,
    CourseSettings,
    PatchCourseGroupAction,
    Role,
)

logger = logging.getLogger("main")


def course_to_json(course: Course, extra: dict = {}) -> dict:
    data = to_base_json(course)

    data.update(
        {
            NAME: course.name,
            OWNER: user_to_json(course.owner),
            DESCRIPTION: course.description,
            IS_PUBLISHED: course.is_published,
        }
    )

    data.update(extra)

    return data


def course_with_settings_to_json(course: Course) -> dict:
    course_settings: CourseSettings = course.coursesettings
    return course_to_json(
        course=course,
        extra={
            SHOW_GROUP_MEMBERS_NAMES: course_settings.show_group_members_names,
            ALLOW_MEMBERS_TO_CREATE_GROUPS: course_settings.allow_members_to_create_groups,
            ALLOW_MEMBERS_TO_DELETE_GROUPS: course_settings.allow_members_to_delete_groups,
            ALLOW_MEMBERS_TO_JOIN_GROUPS: course_settings.allow_members_to_join_groups,
            ALLOW_MEMBERS_TO_LEAVE_GROUPS: course_settings.allow_members_to_leave_groups,
            ALLOW_MEMBERS_TO_MODIFY_GROUP_NAME: course_settings.allow_members_to_modify_group_name,
            ALLOW_MEMBERS_TO_ADD_OR_REMOVE_GROUP_MEMBERS: course_settings.allow_members_to_add_or_remove_group_members,
            MILESTONE_ALIAS: course_settings.milestone_alias,
        },
    )


def course_milestone_to_json(milestone: CourseMilestone) -> dict:
    data = to_base_json(milestone)

    data.update(
        {
            NAME: milestone.name,
            DESCRIPTION: milestone.description,
            START_DATE_TIME: parse_datetime_to_ms_timestamp(milestone.start_date_time),
            END_DATE_TIME: parse_datetime_to_ms_timestamp(milestone.end_date_time),
        }
    )

    return data


def course_membership_to_json(membership: CourseMembership) -> dict:
    data = to_base_json(membership)

    data.update({USER: user_to_json(membership.user), ROLE: membership.role})

    return data


def course_group_to_json(group: CourseGroup, extra: dict = {}) -> dict:
    data = to_base_json(group)

    data.update({NAME: group.name, MEMBER_COUNT: group.coursegroupmember_set.count()})

    data.update(extra)

    return data


def course_group_with_members_to_json(group: CourseGroup) -> dict:
    return course_group_to_json(
        group=group,
        extra={
            MEMBERS: [
                course_membership_to_json(group_member.member)
                for group_member in group.coursegroupmember_set.all()
            ],
        },
    )


def get_courses(*args, **kwargs) -> QuerySet[Course]:
    return Course.objects.filter(*args, **kwargs)


@transaction.atomic
def create_course(
    owner: User,
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_members_to_create_groups: bool,
    allow_members_to_delete_groups: bool,
    allow_members_to_join_groups: bool,
    allow_members_to_leave_groups: bool,
    allow_members_to_modify_group_name: bool,
    allow_members_to_add_or_remove_group_members: bool,
    milestone_alias: str,
) -> tuple[Course, CourseMembership]:
    new_course = Course.objects.create(
        owner=owner,
        name=name,
        description=description,
        is_published=is_published,
    )

    ## create course settings
    CourseSettings.objects.create(
        course=new_course,
        show_group_members_names=show_group_members_names,
        allow_members_to_create_groups=allow_members_to_create_groups,
        allow_members_to_delete_groups=allow_members_to_delete_groups,
        allow_members_to_join_groups=allow_members_to_join_groups,
        allow_members_to_leave_groups=allow_members_to_leave_groups,
        allow_members_to_modify_group_name=allow_members_to_modify_group_name,
        allow_members_to_add_or_remove_group_members=allow_members_to_add_or_remove_group_members,
        milestone_alias=milestone_alias.lower(),
    )

    ## IMPORTANT!! make owner as course member
    new_member = CourseMembership.objects.create(
        user=owner, course=new_course, role=Role.CO_OWNER
    )

    return new_course, new_member


@transaction.atomic
def update_course(
    course: Course,
    owner_membership: Optional[CourseMembership],
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_members_to_create_groups: bool,
    milestone_alias: str,
) -> Course:
    if owner_membership is not None:
        course.owner = owner_membership.user

        ## make new owner co-owner role
        if owner_membership.role != Role.CO_OWNER:
            owner_membership.role = Role.CO_OWNER
            owner_membership.save()

    course.name = name
    course.description = description
    course.is_published = is_published
    course.save()

    course_settings: CourseSettings = course.coursesettings
    course_settings.show_group_members_names = show_group_members_names
    course_settings.allow_members_to_create_groups = allow_members_to_create_groups
    course_settings.milestone_alias = milestone_alias.lower()
    course_settings.save()

    return course


@transaction.atomic
def create_course_milestone(
    course: Course,
    name: str,
    description: str,
    start_date_time: datetime,
    end_date_time: Optional[datetime],
) -> CourseMilestone:
    new_milestone = CourseMilestone.objects.create(
        course=course,
        name=name,
        description=description,
        start_date_time=start_date_time,
        end_date_time=end_date_time,
    )

    return new_milestone


@transaction.atomic
def update_course_milestone(
    milestone: CourseMilestone,
    name: str,
    description: str,
    start_date_time: datetime,
    end_date_time: Optional[datetime],
) -> CourseMilestone:
    milestone.name = name
    milestone.description = description
    milestone.start_date_time = start_date_time
    milestone.end_date_time = end_date_time

    milestone.save()

    return milestone


@transaction.atomic
def create_course_membership(
    user: User, course: Course, role: Role
) -> CourseMembership:
    new_membership = CourseMembership.objects.create(
        user=user, course=course, role=role
    )

    return new_membership


@transaction.atomic
def update_course_membership(
    membership: CourseMembership, role: Role
) -> CourseMembership:
    membership.role = role
    membership.save()

    return membership


@transaction.atomic
def create_course_group(course: Course, name: str) -> CourseGroup:
    new_group = CourseGroup.objects.create(course=course, name=name)

    return new_group


@transaction.atomic
def update_course_group(group: CourseGroup, name: str) -> CourseGroup:
    group.name = name
    group.save()

    return group


@transaction.atomic
def update_course_group_members(
    group: CourseGroup, membership: CourseMembership, action: PatchCourseGroupAction
) -> CourseGroup:
    match action:
        case PatchCourseGroupAction.JOIN | PatchCourseGroupAction.ADD:
            CourseGroupMember.objects.create(member=membership, group=group)
        case PatchCourseGroupAction.LEAVE | PatchCourseGroupAction.REMOVE:
            num_deleted, _ = CourseGroupMember.objects.filter(
                member=membership, group=group
            ).delete()

            if num_deleted == 0:
                logger.warning(f"Action cannot be executed: {action}")
                raise ValueError("User does not exist in this group.")
        case _:
            logger.warning(f"Invalid action: {action}")
            raise ValueError(f"Invalid action.")

    updated_group = CourseGroup.objects.prefetch_related(
        Prefetch(
            lookup="coursegroupmember_set",
            queryset=CourseGroupMember.objects.select_related(
                "member__user__profile_image"
            ),
        )
    ).get(id=group.id)

    return updated_group
