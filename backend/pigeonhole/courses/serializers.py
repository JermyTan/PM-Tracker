from rest_framework import serializers

from .models import Course, CourseMilestone


class PostCourseSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        required=True, allow_blank=True
    )  ## need to override auto-generated one to make it required
    show_group_members_names = serializers.BooleanField(required=True)
    allow_members_to_create_groups = serializers.BooleanField(required=True)
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
            "milestone_alias",
        )


class PutCourseSerializer(PostCourseSerializer):
    owner_id = serializers.IntegerField(required=False, min_value=1)

    class Meta(PostCourseSerializer.Meta):
        fields = PostCourseSerializer.Meta.fields + ("owner_id",)


class PostCourseMilestoneSerializer(serializers.ModelSerializer):
    description = serializers.CharField(
        required=True, allow_blank=True
    )  ## need to override auto-generated one to make it required
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
