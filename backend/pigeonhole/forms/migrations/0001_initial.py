# Generated by Django 4.0.2 on 2022-03-17 03:11

from django.db import migrations, models
import django_update_from_dict
import forms.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('form_field_data', models.JSONField(blank=True, default=forms.models.default_list)),
            ],
            options={
                'abstract': False,
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
    ]
