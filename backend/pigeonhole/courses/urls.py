from django.urls import path

from .views import (
    CourseSubmissionFieldCommentsView,
    MyCoursesView,
    SingleCourseView,
    CourseMilestonesView,
    SingleCourseMilestoneView,
    CourseMembershipsView,
    SingleCourseMembershipView,
    CourseGroupsView,
    SingleCourseGroupView,
    CourseMilestoneTemplatesView,
    SingleCourseMilestoneTemplateView,
    CourseSubmissionsView,
    SingleCourseSubmissionView,
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
    ),
    path(
        "<int:course_id>/templates/",
        CourseMilestoneTemplatesView.as_view(),
        name="course_milestone_templates",
    ),
    path(
        "<int:course_id>/templates/<int:template_id>/",
        SingleCourseMilestoneTemplateView.as_view(),
        name="single_course_milestone_template",
    ),
    path(
        "<int:course_id>/submissions/",
        CourseSubmissionsView.as_view(),
        name="course_submissions",
    ),
    path(
        "<int:course_id>/submissions/<int:submission_id>/",
        SingleCourseSubmissionView.as_view(),
        name="single_course_submission",
    ),
    path(
        "<int:course_id>/memberships/",
        CourseMembershipsView.as_view(),
        name="course_memberships",
    ),
    path(
        "<int:course_id>/memberships/<int:member_id>/",
        SingleCourseMembershipView.as_view(),
        name="single_course_membership",
    ),
    path(
        "<int:course_id>/groups/",
        CourseGroupsView.as_view(),
        name="course_groups",
    ),
    path(
        "<int:course_id>/groups/<int:group_id>/",
        SingleCourseGroupView.as_view(),
        name="single_course_group",
    ),
    path(
        "<int:course_id>/submissions/<int:submission_id>/comments/",
        CourseSubmissionFieldCommentsView.as_view(),
        name="course_submission_field_comments",
    ),
]
