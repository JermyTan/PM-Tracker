from django.db.models import Q, QuerySet

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from pigeonhole.common.constants import ROLE
from users.middlewares import check_access
from users.models import User, AccountType
from .models import CourseMember, Role
from .logic import course_to_json

# Create your views here.
class MyCoursesView(APIView):
    @check_access(AccountType.ADMIN, AccountType.EDUCATOR, AccountType.STANDARD)
    def get(self, request, requester: User):
        ## only show courses which
        visible_memberships: QuerySet[CourseMember] = requester.coursemember_set.filter(
            ~Q(role=Role.MEMBER) | Q(course__is_published=True)
        ).select_related("course__owner__profile_image")

        data = [
            course_to_json(course=member.course, extra={ROLE: member.role})
            for member in visible_memberships
        ]

        return Response(data, status=status.HTTP_200_OK)
