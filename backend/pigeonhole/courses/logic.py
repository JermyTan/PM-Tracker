from typing import Optional

from django.db.models import QuerySet
from django.db import transaction

from pigeonhole.common.constants import NAME, OWNER, DESCRIPTION, IS_PUBLISHED
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
    new_owner_membership: Optional[CourseMembership],
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_members_to_create_groups: bool,
    milestone_alias: str,
) -> Course:
    if new_owner_membership is not None:
        course.owner = new_owner_membership.user
        ## make new owner co-owner role
        new_owner_membership.role = Role.CO_OWNER
        new_owner_membership.save()

    course.name = name
    course.description = description
    course.is_published = is_published
    course.save()

    course_settings: CourseSettings = course.coursesettings
    course_settings.show_group_members_names = show_group_members_names
    course_settings.allow_members_to_create_groups = allow_members_to_create_groups
    course_settings.milestone_alias = milestone_alias
    course_settings.save()

    return course
