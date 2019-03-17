import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter, Comment


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class Query(object):
    all_projects = graphene.List(ProjectType)
    all_chapters = graphene.List(ChapterType)
    all_comments = graphene.List(CommentType)

    def resolve_all_projects(self, info, **kwargs):
        return Project.objects.all()

    def resolve_all_chapters(self, info, **kwargs):
        # We can easily optimize query count in the resolve method
        return Chapter.objects.select_related('project').all()

    def resolve_all_comments(self, info, **kwargs):
        return Comment.objects.select_related('chapter').all()
