# Generated by Django 4.0.2 on 2022-03-17 03:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0002_form_creator'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='form',
            name='creator',
        ),
    ]
