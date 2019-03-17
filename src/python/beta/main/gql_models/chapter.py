import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter
from django.contrib.auth.models import User


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter
