# Generated by Django 4.0.2 on 2022-03-15 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_remove_coursemilestone_course_milestone_start_date_time_lt_end_date_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursesettings',
            name='allow_members_to_add_or_remove_group_members',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='coursesettings',
            name='allow_members_to_delete_groups',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='coursesettings',
            name='allow_members_to_join_groups',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='coursesettings',
            name='allow_members_to_leave_groups',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='coursesettings',
            name='allow_members_to_modify_group_name',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
