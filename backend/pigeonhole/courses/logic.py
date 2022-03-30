import logging
from re import sub
from typing import Optional, Sequence
from datetime import datetime

from django.db.models import QuerySet, Prefetch
from django.db import transaction

from pigeonhole.common.constants import (
    NAME,
    OWNER,
    DESCRIPTION,
    IS_PUBLISHED,
    SHOW_GROUP_MEMBERS_NAMES,
    ALLOW_STUDENTS_TO_CREATE_GROUPS,
    ALLOW_STUDENTS_TO_DELETE_GROUPS,
    ALLOW_STUDENTS_TO_JOIN_GROUPS,
    ALLOW_STUDENTS_TO_LEAVE_GROUPS,
    ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME,
    ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS,
    MILESTONE_ALIAS,
    START_DATE_TIME,
    END_DATE_TIME,
    ROLE,
    USER,
    MEMBER_COUNT,
    MEMBERS,
    SUBMISSION_TYPE,
    FORM_FIELD_DATA,
    IS_DRAFT,
    CREATOR,
    EDITOR,
    FORM_RESPONSE_DATA,
    GROUP,
    MILESTONE,
    ID,
)
from pigeonhole.common.parsers import to_base_json, parse_datetime_to_ms_timestamp
from forms.models import Form
from users.models import User
from users.logic import user_to_json

from .models import (
    Course,
    CourseGroup,
    CourseGroupMember,
    CourseMembership,
    CourseMilestone,
    CourseMilestoneTemplate,
    CourseSettings,
    CourseSubmission,
    PatchCourseGroupAction,
    Role,
    SubmissionType,
)

logger = logging.getLogger("main")


def course_to_json(course: Course) -> dict:
    data = to_base_json(course)

    data |= {
        NAME: course.name,
        OWNER: user_to_json(course.owner),
        DESCRIPTION: course.description,
        IS_PUBLISHED: course.is_published,
    }

    return data


def course_with_settings_to_json(course: Course) -> dict:
    data = course_to_json(course=course)

    course_settings: CourseSettings = course.coursesettings
    data |= {
        SHOW_GROUP_MEMBERS_NAMES: course_settings.show_group_members_names,
        ALLOW_STUDENTS_TO_CREATE_GROUPS: course_settings.allow_students_to_create_groups,
        ALLOW_STUDENTS_TO_DELETE_GROUPS: course_settings.allow_students_to_delete_groups,
        ALLOW_STUDENTS_TO_JOIN_GROUPS: course_settings.allow_students_to_join_groups,
        ALLOW_STUDENTS_TO_LEAVE_GROUPS: course_settings.allow_students_to_leave_groups,
        ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME: course_settings.allow_students_to_modify_group_name,
        ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS: course_settings.allow_students_to_add_or_remove_group_members,
        MILESTONE_ALIAS: course_settings.milestone_alias,
    }

    return data


def course_milestone_to_json(milestone: CourseMilestone) -> dict:
    data = to_base_json(milestone)

    data |= {
        NAME: milestone.name,
        DESCRIPTION: milestone.description,
        START_DATE_TIME: parse_datetime_to_ms_timestamp(milestone.start_date_time),
        END_DATE_TIME: parse_datetime_to_ms_timestamp(milestone.end_date_time),
    }

    return data


def course_membership_to_json(membership: CourseMembership) -> dict:
    data = to_base_json(membership)

    data |= {
        USER: user_to_json(membership.user),
        ROLE: membership.role,
    }

    return data


def course_group_to_json(group: CourseGroup) -> dict:
    data = to_base_json(group)

    data |= {NAME: group.name, MEMBER_COUNT: group.coursegroupmember_set.count()}

    return data


def course_group_with_members_to_json(group: CourseGroup) -> dict:
    data = course_group_to_json(group=group)

    data |= {
        MEMBERS: [
            user_to_json(group_member.member.user)
            for group_member in group.coursegroupmember_set.all()
        ],
    }

    return data


def course_milestone_template_to_json(template: CourseMilestoneTemplate) -> dict:
    data = to_base_json(template)

    data |= {
        NAME: template.form.name,
        DESCRIPTION: template.description,
        SUBMISSION_TYPE: template.submission_type,
        IS_PUBLISHED: template.is_published,
        FORM_FIELD_DATA: template.form.form_field_data,
    }

    return data


def course_submission_summary_to_json(submission: CourseSubmission) -> dict:
    data = to_base_json(submission)

    data |= {
        NAME: submission.name,
        DESCRIPTION: submission.description,
        IS_DRAFT: submission.is_draft,
        CREATOR: user_to_json(submission.creator.user)
        if submission.creator is not None
        else None,
        EDITOR: user_to_json(submission.editor.user)
        if submission.editor is not None
        else None,
        MILESTONE: {ID: submission.milestone.id, NAME: submission.milestone.name}
        if submission.milestone is not None
        else None,
        GROUP: {ID: submission.group.id, NAME: submission.group.name}
        if submission.group is not None
        else None,
    }

    return data


def course_submission_to_json(submission: CourseSubmission) -> dict:
    data = course_submission_summary_to_json(submission)

    data |= {FORM_RESPONSE_DATA: submission.form_response_data}

    return data


def get_courses(*args, **kwargs) -> QuerySet[Course]:
    return Course.objects.filter(*args, **kwargs)


def get_requested_course_submissions(
    course: Course,
    milestone_id: Optional[int],
    group_id: Optional[int],
    creator_id: Optional[int],
    editor_id: Optional[int],
) -> QuerySet[CourseSubmission]:
    submissions: QuerySet[
        CourseSubmission
    ] = course.coursesubmission_set.select_related(
        "milestone",
        "group",
        "creator__user__profile_image",
        "editor__user__profile_image",
    )

    if milestone_id is not None:
        submissions = submissions.filter(milestone_id=milestone_id)

    if group_id is not None:
        submissions = submissions.filter(group_id=group_id)

    if creator_id is not None:
        submissions = submissions.filter(creator__user_id=creator_id)

    if editor_id is not None:
        submissions = submissions.filter(editor__user_id=editor_id)

    return submissions


@transaction.atomic
def create_course(
    owner: User,
    name: str,
    description: str,
    is_published: bool,
    show_group_members_names: bool,
    allow_students_to_create_groups: bool,
    allow_students_to_delete_groups: bool,
    allow_students_to_join_groups: bool,
    allow_students_to_leave_groups: bool,
    allow_students_to_modify_group_name: bool,
    allow_students_to_add_or_remove_group_members: bool,
    milestone_alias: str,
) -> tuple[Course, CourseMembership]:
    new_course = Course.objects.create(
        owner=owner,
        name=name,
        description=description,
        is_published=is_published,
    )

    ## create course settings
    new_course.coursesettings = CourseSettings.objects.create(
        course=new_course,
        show_group_members_names=show_group_members_names,
        allow_students_to_create_groups=allow_students_to_create_groups,
        allow_students_to_delete_groups=allow_students_to_delete_groups,
        allow_students_to_join_groups=allow_students_to_join_groups,
        allow_students_to_leave_groups=allow_students_to_leave_groups,
        allow_students_to_modify_group_name=allow_students_to_modify_group_name,
        allow_students_to_add_or_remove_group_members=allow_students_to_add_or_remove_group_members,
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
    allow_students_to_create_groups: bool,
    allow_students_to_delete_groups: bool,
    allow_students_to_join_groups: bool,
    allow_students_to_leave_groups: bool,
    allow_students_to_modify_group_name: bool,
    allow_students_to_add_or_remove_group_members: bool,
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
    course_settings.allow_students_to_create_groups = allow_students_to_create_groups
    course_settings.allow_students_to_delete_groups = allow_students_to_delete_groups
    course_settings.allow_students_to_join_groups = allow_students_to_join_groups
    course_settings.allow_students_to_leave_groups = allow_students_to_leave_groups
    course_settings.allow_students_to_modify_group_name = (
        allow_students_to_modify_group_name
    )
    course_settings.allow_students_to_add_or_remove_group_members = (
        allow_students_to_add_or_remove_group_members
    )
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


def can_create_course_group(course: Course, membership: CourseMembership) -> bool:
    return (
        membership.role != Role.STUDENT
        or course.coursesettings.allow_students_to_create_groups
    )


def can_view_course_group_members(
    course: Course, membership: CourseMembership, group: CourseGroup
) -> bool:
    return (
        membership.role != Role.STUDENT
        or course.coursesettings.show_group_members_names
        or any(
            group_member.member == membership
            for group_member in group.coursegroupmember_set.all()
        )
    )


def can_update_course_group(
    course: Course,
    membership: CourseMembership,
    group: CourseGroup,
    action: PatchCourseGroupAction,
) -> bool:
    if membership.role != Role.STUDENT:
        return True

    if not any(
        group_member.member == membership
        for group_member in group.coursegroupmember_set.all()
    ):
        return False

    course_settings: CourseSettings = course.coursesettings

    match action:
        case PatchCourseGroupAction.MODIFY:
            return course_settings.allow_students_to_modify_group_name
        case PatchCourseGroupAction.JOIN:
            return course_settings.allow_students_to_join_groups
        case PatchCourseGroupAction.LEAVE:
            return course_settings.allow_students_to_leave_groups
        case PatchCourseGroupAction.ADD | PatchCourseGroupAction.REMOVE:
            return course_settings.allow_students_to_add_or_remove_group_members
        case _:
            return False


def can_delete_course_group(
    course: Course,
    membership: CourseMembership,
    group: CourseGroup,
) -> bool:
    return membership.role != Role.STUDENT or (
        course.coursesettings.allow_students_to_delete_groups
        and any(
            group_member.member == membership
            for group_member in group.coursegroupmember_set.all()
        )
    )


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


@transaction.atomic
def create_course_milestone_template(
    course: Course,
    name: str,
    description: str,
    submission_type: SubmissionType,
    is_published: bool,
    form_field_data: Sequence[dict],
) -> CourseMilestoneTemplate:
    new_form = Form.objects.create(name=name, form_field_data=form_field_data)

    new_template = CourseMilestoneTemplate.objects.create(
        course=course,
        form=new_form,
        description=description,
        submission_type=submission_type,
        is_published=is_published,
    )

    return new_template


@transaction.atomic
def update_course_milestone_template(
    template: CourseMilestoneTemplate,
    name: str,
    description: str,
    submission_type: SubmissionType,
    is_published: bool,
    form_field_data: Sequence[dict],
) -> CourseMilestoneTemplate:
    template.form.name = name
    template.form.form_field_data = form_field_data

    template.form.save()

    template.description = description
    template.submission_type = submission_type
    template.is_published = is_published

    template.save()

    return template
