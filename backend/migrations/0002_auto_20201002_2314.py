# Generated by Django 3.1.1 on 2020-10-02 20:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competitions',
            name='country',
            field=models.CharField(max_length=50, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='leagues',
            name='league',
            field=models.CharField(max_length=50, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='leagues',
            name='league_icon',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='country',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='date',
            field=models.CharField(default=datetime.date(2020, 10, 2), max_length=100),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='kickoff_date',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='kickoff_time',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='league',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='match',
            field=models.CharField(max_length=70),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='match_image',
            field=models.CharField(default='DEFAULT_IMAGE', max_length=100),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_one_type',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_one_value',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_three_type',
            field=models.CharField(default='Non-Provided', max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_three_value',
            field=models.CharField(default='Non-Provided', max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_two_type',
            field=models.CharField(default='Non-Provided', max_length=50),
        ),
        migrations.AlterField(
            model_name='predictions',
            name='prediction_two_value',
            field=models.CharField(default='Non-Provided', max_length=50),
        ),
    ]
