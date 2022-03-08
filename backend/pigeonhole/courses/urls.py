from django.urls import path

from .views import (
    MyCoursesView,
    SingleCourseView,
    CourseMilestonesView,
    SingleCourseMilestoneView,
)

urlpatterns = [
    path("", MyCoursesView.as_view(), name="my_courses"),
    path("<int:course_id>/", SingleCourseView.as_view(), name="single_course"),
    path(
        "<int:course_id>/milestones/",
        CourseMilestonesView.as_view(),
        name="course_milestones",
    ),
    path(
        "<int:course_id>/milestones/<int:milestone_id>/",
        SingleCourseMilestoneView.as_view(),
        name="single_course_milestone",
    )
    # path("self", RequesterView.as_view(), name="self"),
    # path("invite", UserInvitesView.as_view(), name="user_invites"),
    # path(
    #     "invite/<int:user_invite_id>",
    #     SingleUserInviteView.as_view(),
    #     name="single_user_invite",
    # ),
    # path("<int:user_id>", SingleUserView.as_view(), name="single_user"),
]
