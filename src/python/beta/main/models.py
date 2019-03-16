from django.db import models
# https://docs.djangoproject.com/en/2.1/ref/contrib/postgres/fields/#arrayfield
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField()


class Chapter(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    chapter_text = models.TextField()
    version = models.IntegerField(default=1)


class Comment(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    # if the commenter's user is deleted, we want to just set it null, not delete the comment
    commenter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    reference_start = models.IntegerField(
        'the id of the word in the chapter this comment starts at')
    reference_end = models.IntegerField(
        'the id of the word in the chapter this comment ends at')
    tags = ArrayField(models.CharField(
        max_length=200, blank=True), default=list)
