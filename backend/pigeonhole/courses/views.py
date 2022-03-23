import logging

from django.db import IntegrityError
from django.db.models import Q, QuerySet, Prefetch

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from pigeonhole.common.constants import ROLE, MILESTONE
from pigeonhole.common.parsers import parse_ms_timestamp_to_datetime
from pigeonhole.common.exceptions import BadRequest, InternalServerError
from users.logic import get_users
from users.middlewares import check_account_access
from users.models import User, AccountType
from .models import (
    Course,
    CourseGroup,
    CourseGroupMember,
    CourseMembership,
    CourseMilestone,
    CourseMilestoneTemplate,
    PatchCourseGroupAction,
    Role,
)
from .logic import (
    course_group_to_json,
    course_group_with_members_to_json,
    course_membership_to_json,
    course_milestone_template_to_json,
    course_to_json,
    course_with_settings_to_json,
    course_milestone_to_json,
    create_course,
    create_course_group,
    create_course_membership,
    create_course_milestone_template,
    update_course,
    create_course_milestone,
    update_course_group,
    update_course_group_members,
    update_course_milestone,
    update_course_membership,
    update_course_milestone_template,
)
from .serializers import (
    PatchCourseGroupSerializer,
    PostCourseGroupSerializer,
    PostCourseMilestoneTemplateSerializer,
    PostCourseSerializer,
    PutCourseMilestoneTemplateSerializer,
    PutCourseSerializer,
    PostCourseMilestoneSerializer,
    PutCourseMilestoneSerializer,
    PostCourseMembershipSerializer,
    PatchCourseMembershipSerializer,
)
from .middlewares import (
    check_course,
    check_group,
    check_membership,
    check_requester_membership,
    check_milestone,
    check_template,
)

logger = logging.getLogger("main")

# Create your views here.
class MyCoursesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    def get(self, request, requester: User):
        ## only show courses which are published or if course membership role is above STUDENT
        visible_memberships: QuerySet[
            CourseMembership
        ] = requester.coursemembership_set.filter(
            ~Q(role=Role.STUDENT) | Q(course__is_published=True)
        ).select_related(
            "course__owner__profile_image"
        )

        data = [
            course_to_json(course=membership.course, extra={ROLE: membership.role})
            for membership in visible_memberships
        ]

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.EDUCATOR, AccountType.ADMIN)
    def post(self, request, requester: User):
        serializer = PostCourseSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        new_course, new_membership = create_course(
            owner=requester,
            name=validated_data["name"],
            description=validated_data["description"],
            is_published=validated_data["is_published"],
            show_group_members_names=validated_data["show_group_members_names"],
            allow_students_to_create_groups=validated_data[
                "allow_students_to_create_groups"
            ],
            allow_students_to_delete_groups=validated_data[
                "allow_students_to_delete_groups"
            ],
            allow_students_to_join_groups=validated_data[
                "allow_students_to_join_groups"
            ],
            allow_students_to_leave_groups=validated_data[
                "allow_students_to_leave_groups"
            ],
            allow_students_to_modify_group_name=validated_data[
                "allow_students_to_modify_group_name"
            ],
            allow_students_to_add_or_remove_group_members=validated_data[
                "allow_students_to_add_or_remove_group_members"
            ],
            milestone_alias=validated_data["milestone_alias"],
        )

        data = course_to_json(course=new_course, extra={ROLE: new_membership.role})

        return Response(data=data, status=status.HTTP_201_CREATED)


class SingleCourseView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        data = course_with_settings_to_json(course)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.CO_OWNER)
    def put(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        serializer = PutCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        owner_id = validated_data.get("owner_id")

        ## only course owner can update owner
        if owner_id is not None and course.owner != requester:
            raise PermissionDenied()

        try:
            owner_membership = (
                None
                if owner_id is None or owner_id == course.owner.id
                else course.coursemembership_set.select_related(
                    "user__profile_image"
                ).get(user_id=owner_id)
            )
        except CourseMembership.DoesNotExist as e:
            logger.warning(e)
            raise BadRequest(
                detail="New owner is not in this course.", code="invalid_owner"
            )

        updated_course = update_course(
            course=course,
            owner_membership=owner_membership,
            name=validated_data["name"],
            description=validated_data["description"],
            is_published=validated_data["is_published"],
            show_group_members_names=validated_data["show_group_members_names"],
            allow_students_to_create_groups=validated_data[
                "allow_students_to_create_groups"
            ],
            allow_students_to_delete_groups=validated_data[
                "allow_students_to_delete_groups"
            ],
            allow_students_to_join_groups=validated_data[
                "allow_students_to_join_groups"
            ],
            allow_students_to_leave_groups=validated_data[
                "allow_students_to_leave_groups"
            ],
            allow_students_to_modify_group_name=validated_data[
                "allow_students_to_modify_group_name"
            ],
            allow_students_to_add_or_remove_group_members=validated_data[
                "allow_students_to_add_or_remove_group_members"
            ],
            milestone_alias=validated_data["milestone_alias"],
        )

        data = course_with_settings_to_json(updated_course)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.CO_OWNER)
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        ## only course owner can delete course
        if course.owner != requester:
            raise PermissionDenied()

        data = course_with_settings_to_json(course)

        course.delete()

        return Response(data=data, status=status.HTTP_200_OK)


class CourseMilestonesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        milestones: QuerySet[CourseMilestone] = course.coursemilestone_set.all()

        data = [course_milestone_to_json(milestone) for milestone in milestones]

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.INSTRUCTOR, Role.CO_OWNER)
    def post(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        serializer = PostCourseMilestoneSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            new_milestone = create_course_milestone(
                course=course,
                name=validated_data["name"],
                description=validated_data["description"],
                start_date_time=parse_ms_timestamp_to_datetime(
                    validated_data["start_date_time"]
                ),
                end_date_time=parse_ms_timestamp_to_datetime(
                    validated_data["end_date_time"]
                ),
            )
        except IntegrityError as e:
            logger.warning(e)
            raise BadRequest(
                detail=f"Another {course.coursesettings.milestone_alias or MILESTONE} with the same name already exists in this course.",
                code="same_name_milestone_exists",
            )

        data = course_milestone_to_json(new_milestone)

        return Response(data=data, status=status.HTTP_201_CREATED)


class SingleCourseMilestoneView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.INSTRUCTOR, Role.CO_OWNER)
    @check_milestone
    def put(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        milestone: CourseMilestone,
    ):
        serializer = PutCourseMilestoneSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        updated_milestone = update_course_milestone(
            milestone=milestone,
            name=validated_data["name"],
            description=validated_data["description"],
            start_date_time=parse_ms_timestamp_to_datetime(
                validated_data["start_date_time"]
            ),
            end_date_time=parse_ms_timestamp_to_datetime(
                validated_data["end_date_time"]
            ),
        )

        data = course_milestone_to_json(updated_milestone)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.INSTRUCTOR, Role.CO_OWNER)
    @check_milestone
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        milestone: CourseMilestone,
    ):
        data = course_milestone_to_json(milestone)

        milestone.delete()

        return Response(data=data, status=status.HTTP_200_OK)


class CourseMembershipsView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        memberships: QuerySet[
            CourseMembership
        ] = course.coursemembership_set.select_related("user__profile_image")

        data = [course_membership_to_json(membership) for membership in memberships]

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.CO_OWNER)
    def post(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        serializer = PostCourseMembershipSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            user = (
                get_users(id=validated_data["user_id"])
                .select_related("profile_image")
                .get()
            )
        except User.DoesNotExist as e:
            logger.warning(e)
            raise BadRequest(detail="No user found.", code="invalid_user")

        try:
            new_membership = create_course_membership(
                user=user, course=course, role=validated_data["role"]
            )
        except IntegrityError as e:
            logger.warning(e)
            raise BadRequest(
                detail="User already exists in this course.", code="user_exists"
            )

        data = course_membership_to_json(new_membership)

        return Response(data=data, status=status.HTTP_201_CREATED)


class SingleCourseMembershipView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.CO_OWNER)
    @check_membership
    def patch(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        membership: CourseMembership,
    ):
        if requester_membership == membership:
            raise PermissionDenied()

        serializer = PatchCourseMembershipSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        updated_membership = update_course_membership(
            membership=membership, role=validated_data["role"]
        )

        data = course_membership_to_json(updated_membership)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.CO_OWNER)
    @check_membership
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        membership: CourseMembership,
    ):
        if requester_membership == membership:
            raise PermissionDenied()

        data = course_membership_to_json(membership)

        membership.delete()

        return Response(data=data, status=status.HTTP_200_OK)


class CourseGroupsView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        ## prefetch related is used for performance optimization
        ## reference: https://betterprogramming.pub/django-select-related-and-prefetch-related-f23043fd635d
        groups: QuerySet[CourseGroup] = course.coursegroup_set.prefetch_related(
            Prefetch(
                lookup="coursegroupmember_set",
                queryset=CourseGroupMember.objects.select_related(
                    "member__user__profile_image"
                ),
            )
        )

        if (
            requester_membership.role == Role.STUDENT
            and not course.coursesettings.show_group_members_names
        ):
            data = [
                course_group_with_members_to_json(group)
                if any(
                    group_member.member == requester_membership
                    for group_member in group.coursegroupmember_set.all()
                )
                else course_group_to_json(group)
                for group in groups
            ]
        else:
            data = [course_group_with_members_to_json(group) for group in groups]

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def post(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        if (
            requester_membership.role == Role.STUDENT
            and not course.coursesettings.allow_students_to_create_groups
        ):
            raise PermissionDenied()

        serializer = PostCourseGroupSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            new_group = create_course_group(course=course, name=validated_data["name"])
        except IntegrityError as e:
            logger.warning(e)
            raise BadRequest(
                detail=f"Another group with the same name already exists in this course.",
                code="same_name_group_exists",
            )

        data = course_group_to_json(new_group)

        return Response(data=data, status=status.HTTP_201_CREATED)


class SingleCourseGroupView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    @check_group
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        group: CourseGroup,
    ):
        ## reject if role is STUDENT and yet not part of the group
        if requester_membership.role == Role.STUDENT and not any(
            group_member.member == requester_membership
            for group_member in group.coursegroupmember_set.all()
        ):
            raise PermissionDenied()

        data = course_group_with_members_to_json(group)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    @check_group
    def patch(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        group: CourseGroup,
    ):
        ## reject if role is STUDENT and yet not part of the group
        if requester_membership.role == Role.STUDENT and not any(
            group_member.member == requester_membership
            for group_member in group.coursegroupmember_set.all()
        ):
            raise PermissionDenied()

        serializer = PatchCourseGroupSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        action = validated_data["action"]
        payload = validated_data["payload"]

        match action:
            case PatchCourseGroupAction.MODIFY:
                updated_course = update_course_group(group=group, name=payload["name"])
            case PatchCourseGroupAction.JOIN | PatchCourseGroupAction.LEAVE | PatchCourseGroupAction.ADD | PatchCourseGroupAction.REMOVE:
                match action:
                    case PatchCourseGroupAction.ADD | PatchCourseGroupAction.REMOVE:
                        try:
                            membership = course.coursemembership_set.get(
                                user_id=payload["user_id"]
                            )
                        except CourseMembership.DoesNotExist as e:
                            logger.warning(e)
                            raise BadRequest(
                                detail="No such user found in this course.",
                                code="no_membership_found",
                            )

                    case PatchCourseGroupAction.JOIN | PatchCourseGroupAction.LEAVE:
                        membership = requester_membership
                    case _:  ## should never enter this case
                        raise InternalServerError(
                            detail="Invalid action.", code="invalid_action"
                        )

                try:
                    updated_course = update_course_group_members(
                        group=group, membership=membership, action=action
                    )
                except IntegrityError as e:
                    logger.warning(e)
                    raise BadRequest(
                        detail="User already exists in this group.", code="user_exists"
                    )
                except ValueError as e:
                    logger.warning(e)
                    raise BadRequest(detail=e)
            case _:
                raise BadRequest(detail="Invalid action.", code="invalid_action")

        data = course_group_with_members_to_json(updated_course)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    @check_group
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        group: CourseGroup,
    ):
        if (
            requester_membership.role == Role.STUDENT
            and not course.coursesettings.allow_students_to_delete_groups
        ):
            raise PermissionDenied()

        data = course_group_with_members_to_json(group)

        group.delete()

        return Response(data=data, status=status.HTTP_200_OK)


class CourseMilestoneTemplatesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        ## only show courses which are published or if course membership role is above STUDENT
        visible_templates: QuerySet[
            CourseMilestoneTemplate
        ] = course.coursemilestonetemplate_set.select_related("form")

        if requester_membership.role == Role.STUDENT:
            visible_templates = visible_templates.filter(is_published=True)

        data = [
            course_milestone_template_to_json(template)
            for template in visible_templates
        ]

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.INSTRUCTOR, Role.CO_OWNER)
    def post(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        serializer = PostCourseMilestoneTemplateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        new_template = create_course_milestone_template(
            course=course,
            name=validated_data["name"],
            description=validated_data["description"],
            submission_type=validated_data["submission_type"],
            is_published=validated_data["is_published"],
            form_field_data=validated_data["form_field_data"],
        )

        data = course_milestone_template_to_json(new_template)

        return Response(data=data, status=status.HTTP_201_CREATED)


class SingleCourseMilestoneTemplateView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.INSTRUCTOR, Role.CO_OWNER)
    @check_template
    def put(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        template: CourseMilestoneTemplate,
    ):
        serializer = PutCourseMilestoneTemplateSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        updated_template = update_course_milestone_template(
            template=template,
            name=validated_data["name"],
            description=validated_data["description"],
            submission_type=validated_data["submission_type"],
            is_published=validated_data["is_published"],
            form_field_data=validated_data["form_field_data"],
        )

        data = course_milestone_template_to_json(updated_template)

        return Response(data=data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    @check_template
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        template: CourseMilestoneTemplate,
    ):
        data = course_milestone_template_to_json(template)

        template.delete()

        return Response(data, status=status.HTTP_200_OK)


class CourseSubmissionsView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        return Response(status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def post(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        return Response(status=status.HTTP_201_CREATED)


class SingleCourseSubmissionView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def patch(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        submission_id: int,
    ):
        return Response(status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_requester_membership(Role.STUDENT, Role.INSTRUCTOR, Role.CO_OWNER)
    def delete(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
        submission_id: int,
    ):
        return Response(status=status.HTTP_200_OK)
