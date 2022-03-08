from django.db import models

from pigeonhole.common.models import TimestampedModel
from users.models import User


class Role(models.TextChoices):
    CO_OWNER = "CO-OWNER"
    INSTRUCTOR = "INSTRUCTOR"
    MEMBER = "MEMBER"


MAX_ROLE_LENGTH = max(map(len, Role))

# Create your models here.
class Course(TimestampedModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField()

    def __str__(self) -> str:
        return f"{self.name} | {self.owner}"


## Table extension of Course
## Only owner and co-owner can modify
class CourseSettings(TimestampedModel):
    course = models.OneToOneField(Course, on_delete=models.CASCADE)
    show_group_members_names = models.BooleanField()
    allow_members_to_create_groups = models.BooleanField()
    milestone_alias = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name_plural = "course settings"

    def __str__(self) -> str:
        return f"{self.course}"


class CourseMembership(TimestampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=MAX_ROLE_LENGTH, choices=Role.choices, default=Role.MEMBER
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "course_id"], name="unique_course_membership"
            )
        ]

    def __str__(self) -> str:
        return f"{self.user} | {self.role} | {self.course.name}"


class CourseGroup(TimestampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course_id", "name"], name="unique_course_group_name"
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} | {self.course.name}"


class CourseGroupMember(TimestampedModel):
    member = models.ForeignKey(CourseMembership, on_delete=models.CASCADE)
    group = models.ForeignKey(CourseGroup, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["member_id", "group_id"],
                name="unique_course_group_member",
            )
        ]

    def __str__(self) -> str:
        return f"{self.group.name} | {self.member}"


class CourseMilestone(TimestampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course_id", "name"],
                name="unique_course_milestone_name",
            ),
            models.CheckConstraint(
                check=models.Q(start_date_time__lt=models.F("end_date_time")),
                name="course_milestone_start_date_time_lt_end_date_time",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name} | {self.course.name}"


class CourseSubmission(TimestampedModel):
    associated_milestone = models.ForeignKey(
        CourseMilestone, on_delete=models.SET_NULL, blank=True, null=True
    )
    associated_group = models.ForeignKey(
        CourseGroup, on_delete=models.SET_NULL, blank=True, null=True
    )
    parent_submission = models.ForeignKey(
        "self", on_delete=models.SET_NULL, blank=True, null=True
    )
    creator = models.ForeignKey(CourseMembership, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=~models.Q(id=models.F("parent_submission_id")),
                name="course_submission_parent_not_self_referencing",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.title} | {self.creator}"
