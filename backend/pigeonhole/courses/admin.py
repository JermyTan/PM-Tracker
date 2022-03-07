from django.contrib import admin
from .models import (
    Course,
    CourseSettings,
    CourseMember,
    CourseGroup,
    CourseGroupMember,
    CourseMilestone,
    CourseSubmission,
)

# Register your models here.
admin.site.register(Course)
admin.site.register(CourseSettings)
admin.site.register(CourseMember)
admin.site.register(CourseGroup)
admin.site.register(CourseGroupMember)
admin.site.register(CourseMilestone)
admin.site.register(CourseSubmission)
