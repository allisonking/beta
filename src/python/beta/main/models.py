from django.db import models
# https://docs.djangoproject.com/en/2.1/ref/contrib/postgres/fields/#arrayfield
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.title


class Chapter(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=True)
    chapter_text = models.TextField()
    order_num = models.IntegerField(
        'chapter number for ordering purposes', default=1)
    version = models.IntegerField(default=1)

    def __str__(self):
        if self.title:
            return self.title
        # return the first 100 characters of the text if no title exists
        return f'{self.chapter_text[0:100]}...'


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

    def __str__(self):
        # return the first 100 characters of the text
        return f'{self.text[0:100]}...'
