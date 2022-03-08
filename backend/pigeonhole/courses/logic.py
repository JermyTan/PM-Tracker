from typing import Optional

from django.db.models import QuerySet
from django.db import transaction

from pigeonhole.common.constants import (
    NAME,
    OWNER,
    DESCRIPTION,
    IS_PUBLISHED,
    SHOW_GROUP_MEMBERS_NAMES,
    ALLOW_MEMBERS_TO_CREATE_GROUPS,
    MILESTONE_ALIAS,
)
from pigeonhole.common.parsers import to_base_json
from users.models import User
from users.logic import user_to_json

from .models import Course, CourseMembership, CourseSettings, Role


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
            MILESTONE_ALIAS: course_settings.milestone_alias,
        },
    )


def get_courses(*args, **kwargs) -> QuerySet[Course]:
    return Course.objects.filter(*args, **kwargs)


def get_course_memberships(*args, **kwargs) -> QuerySet[CourseMembership]:
    return CourseMembership.objects.filter(*args, **kwargs)


@transaction.atomic
def create_course(
    owner: User,
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_members_to_create_groups: bool,
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
        milestone_alias=milestone_alias,
    )

    ## IMPORTANT!! make owner as course member
    new_member = CourseMembership.objects.create(
        user=owner, course=new_course, role=Role.CO_OWNER
    )

    return new_course, new_member


@transaction.atomic
def update_course(
    course: Course,
    owner_membership: CourseMembership,
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_members_to_create_groups: bool,
    milestone_alias: str,
) -> Course:
    course.owner = owner_membership.user
    course.name = name
    course.description = description
    course.is_published = is_published
    course.save()

    course_settings: CourseSettings = course.coursesettings
    course_settings.show_group_members_names = show_group_members_names
    course_settings.allow_members_to_create_groups = allow_members_to_create_groups
    course_settings.milestone_alias = milestone_alias
    course_settings.save()

    ## make new owner co-owner role
    if owner_membership.role != Role.CO_OWNER:
        owner_membership.role = Role.CO_OWNER
        owner_membership.save()

    return course
