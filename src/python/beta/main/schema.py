import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter, Comment
from django.contrib.auth.models import User
from main.gql_models.project import ProjectType, CreateProject, DeleteProject, UpdateProject
from main.gql_models.user import UserType, CreateUser, DeleteUser, UpdateUser
from main.gql_models.chapter import ChapterType, CreateChapter, DeleteChapter, UpdateChapter
from main.gql_models.comment import CommentType, CreateComment, DeleteComment, UpdateComment


class Mutation(graphene.ObjectType):
    # user
    create_user = CreateUser.Field()
    delete_user = DeleteUser.Field()
    update_user = UpdateUser.Field()

    # project
    create_project = CreateProject.Field()
    delete_project = DeleteProject.Field()
    update_project = UpdateProject.Field()

    # chapter
    create_chapter = CreateChapter.Field()
    delete_chapter = DeleteChapter.Field()
    update_chapter = UpdateChapter.Field()

    # comment
    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()
    update_comment = UpdateComment.Field()


class Query(object):

    ##########################
    # Get all objects
    ##########################
    all_projects = graphene.List(ProjectType)
    all_chapters = graphene.List(ChapterType)
    all_comments = graphene.List(CommentType)
    all_users = graphene.List(UserType)

    def resolve_all_projects(self, info, **kwargs):
        return Project.objects.all()

    def resolve_all_chapters(self, info, **kwargs):
        # We can easily optimize query count in the resolve method
        return Chapter.objects.select_related('project').all()

    def resolve_all_comments(self, info, **kwargs):
        return Comment.objects.select_related('chapter').all()

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    ##########################
    # Get individual objects
    ##########################
    project = graphene.Field(ProjectType, id=graphene.Int())
    chapter = graphene.Field(ChapterType, id=graphene.Int())
    comment = graphene.Field(CommentType, id=graphene.Int())
    user = graphene.Field(UserType, id=graphene.Int(),
                          username=graphene.String())

    def resolve_project(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Project.objects.get(pk=id)

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

    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')

        if id is not None:
            return User.objects.get(pk=id)

        if username is not None:
            return User.objects.get(username=username)

        return None
