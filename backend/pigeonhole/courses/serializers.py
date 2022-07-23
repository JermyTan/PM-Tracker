from rest_framework import serializers

from pigeonhole.common.models import MergeSerializersMixin
from pigeonhole.common.serializers import (
    NameSerializer,
    UserIdSerializer,
    IdField,
    ObjectListField,
)
from forms.serializers import FormSerializer

from .models import (
    Course,
    CourseGroup,
    CourseMembership,
    CourseMilestone,
    CourseMilestoneTemplate,
    CourseSettings,
    CourseSubmission,
    CourseSubmissionFieldComment,
    PatchCourseGroupAction,
    Role,
)


class CourseSettingsSerializer(serializers.ModelSerializer):
    ## need to override auto-generated one to make it required
    milestone_alias = serializers.CharField(
        required=True, max_length=255, allow_blank=True
    )

    class Meta:
        model = CourseSettings
        fields = (
            "show_group_members_names",
            "allow_students_to_create_groups",
            "allow_students_to_delete_groups",
            "allow_students_to_join_groups",
            "allow_students_to_leave_groups",
            "allow_students_to_modify_group_name",
            "allow_students_to_add_or_remove_group_members",
            "milestone_alias",
        )


class PostCourseSerializer(MergeSerializersMixin, serializers.ModelSerializer):
    ## need to override auto-generated one to make it required
    description = serializers.CharField(required=True, allow_blank=True)

    class Meta:
        model = Course
        fields = ("name", "description", "is_published")
        merge_serializers = (CourseSettingsSerializer,)


class PutCourseSerializer(PostCourseSerializer):
    owner_id = IdField(required=False)

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
        start_date_time = data["start_date_time"]
        end_date_time = data["end_date_time"]

        if end_date_time is not None and start_date_time >= end_date_time:
            raise serializers.ValidationError(
                "Start date/time must be before end date/time."
            )

        return data

    class Meta:
        model = CourseMilestone
        fields = ("name", "description", "start_date_time", "end_date_time", "is_published")


PutCourseMilestoneSerializer = PostCourseMilestoneSerializer


class PostCourseMembershipSerializer(serializers.ModelSerializer):
    user_id = IdField(required=True)
    ## need to override auto-generated one to make it required
    role = serializers.ChoiceField(required=True, choices=Role.choices)

    class Meta:
        model = CourseMembership
        fields = ("role",)


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

    def validate(self, data):
        """
        Check the payload according to action
        """
        action = data["action"]
        payload = data["payload"]

        match action:
            case PatchCourseGroupAction.MODIFY:
                serializer = NameSerializer(data=payload)
                serializer.is_valid(raise_exception=True)
            case PatchCourseGroupAction.ADD | PatchCourseGroupAction.REMOVE:
                serializer = UserIdSerializer(data=payload)
                serializer.is_valid(raise_exception=True)

        return data


class PostCourseMilestoneTemplateSerializer(
    MergeSerializersMixin, serializers.ModelSerializer
):
    ## need to override auto-generated one to make it required
    description = serializers.CharField(required=True, allow_blank=True)

    class Meta:
        model = CourseMilestoneTemplate
        fields = ("description", "submission_type", "is_published")
        merge_serializers = (FormSerializer,)


PutCourseMilestoneTemplateSerializer = PostCourseMilestoneTemplateSerializer


class GetCourseSubmissionSerializer(serializers.Serializer):
    milestone_id = IdField(required=False, default=None)
    group_id = IdField(required=False, default=None)
    creator_id = IdField(required=False, default=None)
    editor_id = IdField(required=False, default=None)


class PutCourseSubmissionSerializer(serializers.ModelSerializer):
    group_id = IdField(required=True, allow_null=True)
    ## need to override auto-generated one to make it required
    description = serializers.CharField(required=True, allow_blank=True)
    form_response_data = ObjectListField(required=True)

    class Meta:
        model = CourseSubmission
        fields = (
            "group_id",
            "name",
            "description",
            "is_draft",
            "form_response_data",
        )


class PostCourseSubmissionSerializer(PutCourseSubmissionSerializer):
    milestone_id = IdField(required=True)

    class Meta(PutCourseSubmissionSerializer.Meta):
        fields = PutCourseSubmissionSerializer.Meta.fields + ("milestone_id",)


class PutCourseSubmissionFieldCommentSerializer(serializers.Serializer):
    content = serializers.CharField(required=True)
class PostCourseSubmissionFieldCommentSerializer(PutCourseSubmissionFieldCommentSerializer):
    field_index = serializers.IntegerField(min_value=0)

