from django.contrib import admin

from pigeonhole.common.admin import BaseAdmin
from .models import (
    Course,
    CourseSettings,
    CourseMembership,
    CourseGroup,
    CourseGroupMember,
    CourseMilestone,
    CourseMilestoneTemplate,
    CourseSubmission,
)

# Register your models here.
admin.site.register(Course, BaseAdmin)
admin.site.register(CourseSettings, BaseAdmin)
admin.site.register(CourseMembership, BaseAdmin)
admin.site.register(CourseGroup, BaseAdmin)
admin.site.register(CourseGroupMember, BaseAdmin)
admin.site.register(CourseMilestone, BaseAdmin)
admin.site.register(CourseMilestoneTemplate, BaseAdmin)
admin.site.register(CourseSubmission, BaseAdmin)
