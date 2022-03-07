from django.db.models import QuerySet

from pigeonhole.common.constants import NAME, OWNER, DESCRIPTION, IS_PUBLISHED
from pigeonhole.common.parsers import to_base_json
from users.logic import user_to_json

from .models import Course


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
