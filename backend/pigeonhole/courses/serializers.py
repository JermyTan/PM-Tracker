from rest_framework import serializers

from .models import Course


class PostCourseSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True)
    show_group_members_names = serializers.BooleanField()
    allow_members_to_create_groups = serializers.BooleanField()
    milestone_alias = serializers.CharField(max_length=255, allow_blank=True)

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
    owner_id = serializers.IntegerField(min_value=1, required=False)

    class Meta(PostCourseSerializer.Meta):
        fields = PostCourseSerializer.Meta.fields + ("owner_id",)
