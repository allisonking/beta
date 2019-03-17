import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter, Comment
from django.contrib.auth.models import User


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
