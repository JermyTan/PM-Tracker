from django.contrib import admin
from .models import (
    Course,
    CourseSetting,
    CourseMember,
    CourseGroup,
    CourseGroupMember,
    CourseMilestone,
    CourseSubmission,
)

# Register your models here.
admin.site.register(Course)
admin.site.register(CourseSetting)
admin.site.register(CourseMember)
admin.site.register(CourseGroup)
admin.site.register(CourseGroupMember)
admin.site.register(CourseMilestone)
admin.site.register(CourseSubmission)
