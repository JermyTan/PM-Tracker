# Generated by Django 4.0.2 on 2022-03-07 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='account_type',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('EDUCATOR', 'Educator'), ('STANDARD', 'Standard')], default='STANDARD', max_length=8),
        ),
    ]
