# Generated by Django 4.0.5 on 2022-08-16 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_delete_userinvite_alter_user_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_activated',
            field=models.BooleanField(default=False),
        ),
    ]
