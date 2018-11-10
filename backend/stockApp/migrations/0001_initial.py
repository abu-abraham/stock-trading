# Generated by Django 2.1.2 on 2018-10-03 03:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Purchases',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('purchase_date', models.DateField()),
                ('price', models.FloatField()),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Stocks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=30, unique=True)),
                ('name', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=30, unique=True)),
                ('name', models.CharField(max_length=25)),
                ('earnings', models.FloatField()),
                ('losses', models.FloatField()),
                ('balance', models.FloatField()),
            ],
        ),
        migrations.AddField(
            model_name='purchases',
            name='stock_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stockApp.Stocks'),
        ),
        migrations.AddField(
            model_name='purchases',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stockApp.Users'),
        ),
    ]
