from django.db.models import Q, QuerySet

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from pigeonhole.common.constants import ROLE
from pigeonhole.common.parsers import parse_ms_timestamp_to_datetime
from pigeonhole.common.exceptions import BadRequest
from users.middlewares import check_account_access
from users.models import User, AccountType
from .models import Course, CourseMembership, CourseMilestone, Role
from .logic import (
    course_to_json,
    course_with_settings_to_json,
    course_milestone_to_json,
    create_course,
    update_course,
    create_course_milestone,
    update_course_milestone,
)
from .serializers import (
    PostCourseSerializer,
    PutCourseSerializer,
    PostCourseMilestoneSerializer,
    PutCourseMilestoneSerializer,
)
from .middlewares import check_course, check_membership, check_milestone

# Create your views here.
class MyCoursesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    def get(self, request, requester: User):
        ## only show courses which are published or if course membership role is above member
        visible_memberships: QuerySet[
            CourseMembership
        ] = requester.coursemembership_set.filter(
            ~Q(role=Role.MEMBER) | Q(course__is_published=True)
        ).select_related(
            "course__owner__profile_image"
        )

        data = [
            course_to_json(course=membership.course, extra={ROLE: membership.role})
            for membership in visible_memberships
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.EDUCATOR, AccountType.ADMIN)
    def post(self, request, requester: User):
        serializer = PostCourseSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        new_course, new_membership = create_course(
            owner=requester,
            name=validated_data.get("name", ""),
            description=validated_data.get("description", ""),
            is_published=validated_data.get("is_published", False),
            show_group_members_names=validated_data.get(
                "show_group_members_names", False
            ),
            allow_members_to_create_groups=validated_data.get(
                "allow_members_to_create_groups", False
            ),
            milestone_alias=validated_data.get("milestone_alias", ""),
        )

        data = course_to_json(course=new_course, extra={ROLE: new_membership.role})

        return Response(data, status=status.HTTP_201_CREATED)


class SingleCourseView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership(Role.MEMBER, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        data = course_with_settings_to_json(course)

        return Response(data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership(Role.CO_OWNER)
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
                requester_membership
                if owner_id is None or owner_id == course.owner.id
                else course.coursemembership_set.select_related(
                    "user__profile_image"
                ).get(user_id=owner_id)
            )
        except CourseMembership.DoesNotExist as e:
            raise BadRequest("New owner is not in this course.", code="invalid_owner")

        updated_course = update_course(
            course=course,
            owner_membership=owner_membership,
            name=validated_data.get("name", ""),
            description=validated_data.get("description", ""),
            is_published=validated_data.get("is_published", False),
            show_group_members_names=validated_data.get(
                "show_group_members_names", False
            ),
            allow_members_to_create_groups=validated_data.get(
                "allow_members_to_create_groups", False
            ),
            milestone_alias=validated_data.get("milestone_alias", ""),
        )

        data = course_with_settings_to_json(updated_course)

        return Response(data, status=status.HTTP_200_OK)


class CourseMilestonesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership(Role.MEMBER, Role.INSTRUCTOR, Role.CO_OWNER)
    def get(
        self,
        request,
        requester: User,
        course: Course,
        requester_membership: CourseMembership,
    ):
        milestones: QuerySet[CourseMilestone] = course.coursemilestone_set.all()

        data = [course_milestone_to_json(milestone) for milestone in milestones]

        return Response(data, status=status.HTTP_200_OK)

    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership(Role.INSTRUCTOR, Role.CO_OWNER)
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

        new_milestone = create_course_milestone(
            course=course,
            name=validated_data.get("name", ""),
            description=validated_data.get("description", ""),
            start_date_time=parse_ms_timestamp_to_datetime(
                validated_data.get("start_date_time", 0)
            ),
            end_date_time=parse_ms_timestamp_to_datetime(
                validated_data.get("end_date_time")
            ),
        )

        data = course_milestone_to_json(new_milestone)

        return Response(data, status=status.HTTP_201_CREATED)


class SingleCourseMilestoneView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership(Role.INSTRUCTOR, Role.CO_OWNER)
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
            name=validated_data.get("name", ""),
            description=validated_data.get("description", ""),
            start_date_time=parse_ms_timestamp_to_datetime(
                validated_data.get("start_date_time", 0)
            ),
            end_date_time=parse_ms_timestamp_to_datetime(
                validated_data.get("end_date_time")
            ),
        )

        data = course_milestone_to_json(updated_milestone)

        return Response(data, status=status.HTTP_200_OK)
