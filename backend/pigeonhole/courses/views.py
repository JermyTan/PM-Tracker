from django.db.models import Q, QuerySet

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from pigeonhole.common.constants import ROLE
from pigeonhole.common.exceptions import BadRequest
from users.middlewares import check_account_access
from users.models import User, AccountType
from .models import Course, CourseMembership, Role
from .logic import course_to_json, create_course, get_course_memberships, update_course
from .serializers import PostCourseSerializer, PutCourseSerializer
from .middlewares import check_course, check_membership, check_role_access

# Create your views here.
class MyCoursesView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    def get(self, request, requester: User):
        ## only show courses which
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

        new_course, new_member = create_course(
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

        data = course_to_json(course=new_course, extra={ROLE: new_member.role})

        return Response(data, status=status.HTTP_201_CREATED)


class SingleCourseView(APIView):
    @check_account_access(AccountType.STANDARD, AccountType.EDUCATOR, AccountType.ADMIN)
    @check_course
    @check_membership
    @check_role_access(Role.CO_OWNER)
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

        ## no need to update owner if owner is the same
        if owner_id is None or owner_id == course.owner.id:
            new_owner_membership = None
        else:
            try:
                new_owner_membership = (
                    get_course_memberships(user_id=owner_id, course=course)
                    .select_related("user__profile_image")
                    .get()
                )
            except CourseMembership.DoesNotExist as e:
                raise BadRequest(
                    "New owner is not in this course.", code="invalid_owner"
                )

        updated_course = update_course(
            course=course,
            new_owner_membership=new_owner_membership,
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

        data = course_to_json(updated_course)

        return Response(data, status=status.HTTP_200_OK)
