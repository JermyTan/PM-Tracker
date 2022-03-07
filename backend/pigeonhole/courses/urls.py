from django.urls import path

from .views import MyCoursesView

urlpatterns = [
    path("", MyCoursesView.as_view(), name="my_courses"),
    # path("self", RequesterView.as_view(), name="self"),
    # path("invite", UserInvitesView.as_view(), name="user_invites"),
    # path(
    #     "invite/<int:user_invite_id>",
    #     SingleUserInviteView.as_view(),
    #     name="single_user_invite",
    # ),
    # path("<int:user_id>", SingleUserView.as_view(), name="single_user"),
]
