# Generated by Django 4.0.5 on 2022-08-02 16:24

from django.db import migrations, models
import django.db.models.deletion
import django_update_from_dict


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content', models.TextField()),
                ('is_deleted', models.BooleanField(default=False)),
                ('commenter', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.user')),
            ],
            options={
                'abstract': False,
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
        migrations.CreateModel(
            name='CourseSubmissionFieldComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('field_index', models.PositiveIntegerField()),
                ('comment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='courses.comment')),
                ('course_membership', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='courses.coursemembership')),
                ('submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.coursesubmission')),
            ],
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
        migrations.AddConstraint(
            model_name='coursesubmissionfieldcomment',
            constraint=models.UniqueConstraint(fields=('submission_id', 'comment_id'), name='unique_submission_comment'),
        ),
    ]