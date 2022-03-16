from rest_framework import serializers

from .models import (
    Course,
    CourseGroup,
    CourseMembership,
    CourseMilestone,
    PatchCourseGroupAction,
    Role,
)


class PostCourseSerializer(serializers.ModelSerializer):
    ## need to override auto-generated one to make it required
    description = serializers.CharField(required=True, allow_blank=True)
    show_group_members_names = serializers.BooleanField(required=True)
    allow_members_to_create_groups = serializers.BooleanField(required=True)
    allow_members_to_delete_groups = serializers.BooleanField(required=True)
    allow_members_to_join_groups = serializers.BooleanField(required=True)
    allow_members_to_leave_groups = serializers.BooleanField(required=True)
    allow_members_to_modify_group_name = serializers.BooleanField(required=True)
    allow_members_to_add_or_remove_group_members = serializers.BooleanField(
        required=True
    )
    milestone_alias = serializers.CharField(
        required=True, max_length=255, allow_blank=True
    )

    class Meta:
        model = Course
        fields = (
            "name",
            "description",
            "is_published",
            "show_group_members_names",
            "allow_members_to_create_groups",
            "allow_members_to_delete_groups",
            "allow_members_to_join_groups",
            "allow_members_to_leave_groups",
            "allow_members_to_modify_group_name",
            "allow_members_to_add_or_remove_group_members",
            "milestone_alias",
        )


class PutCourseSerializer(PostCourseSerializer):
    owner_id = serializers.IntegerField(required=False, min_value=1)

    class Meta(PostCourseSerializer.Meta):
        fields = PostCourseSerializer.Meta.fields + ("owner_id",)


class PostCourseMilestoneSerializer(serializers.ModelSerializer):
    ## need to override auto-generated one to make it required
    description = serializers.CharField(required=True, allow_blank=True)
    start_date_time = serializers.IntegerField(required=True, min_value=0)
    end_date_time = serializers.IntegerField(
        required=True, allow_null=True, min_value=0
    )

    def validate(self, data):
        """
        Check that start_date_time is before end_date_time.
        """
        if (
            data["end_date_time"] is not None
            and data["start_date_time"] >= data["end_date_time"]
        ):
            raise serializers.ValidationError(
                "Start date/time must be before end date/time"
            )

        return data

    class Meta:
        model = CourseMilestone
        fields = ("name", "description", "start_date_time", "end_date_time")


PutCourseMilestoneSerializer = PostCourseMilestoneSerializer


class PostCourseMembershipSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(required=True, min_value=1)
    ## need to override auto-generated one to make it required
    role = serializers.ChoiceField(required=True, choices=Role.choices)

    class Meta:
        model = CourseMembership
        fields = ("user_id", "role")


class PatchCourseMembershipSerializer(serializers.ModelSerializer):
    ## need to override auto-generated one to make it required
    role = serializers.ChoiceField(required=True, choices=Role.choices)

    class Meta:
        model = CourseMembership
        fields = ("role",)


class PostCourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = ("name",)


class PatchCourseGroupSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        required=True, choices=PatchCourseGroupAction.choices
    )
    payload = serializers.JSONField(required=True, allow_null=True)
