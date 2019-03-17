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

    ##########################
    # Get all objects
    ##########################
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

    ##########################
    # Get individual objects
    ##########################
    project = graphene.Field(
        ProjectType, id=graphene.Int(), title=graphene.String())
    chapter = graphene.Field(ChapterType, id=graphene.Int())
    comment = graphene.Field(CommentType, id=graphene.Int())

    def resolve_project(self, info, **kwargs):
        id = kwargs.get('id')
        title = kwargs.get('title')

        if id is not None:
            return Project.objects.get(pk=id)

        if title is not None:
            return Project.objects.get(title=title)

        return None

    def resolve_chapter(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Chapter.objects.get(pk=id)

        return None

    def resolve_comment(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Comment.objects.get(pk=id)

        return None
