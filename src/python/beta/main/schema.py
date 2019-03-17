import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter, Comment
from django.contrib.auth.models import User


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project


class CreateProject(graphene.Mutation):
    ok = graphene.Boolean()
    project = graphene.Field(lambda: ProjectType)

    class Arguments:
        title = graphene.String()
        user_id = graphene.Int()

    def mutate(self, info, title, user_id):
        user = User.objects.get(pk=user_id)
        project = Project(title=title, user=user)
        project.save()
        ok = True
        return CreateProject(project=project, ok=ok)


class DeleteProject(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        project_id = graphene.Int()

    def mutate(self, info, project_id):
        Project.objects.filter(id=project_id).delete()
        ok = True
        return DeleteProject(ok=ok)


class UpdateProject(graphene.Mutation):
    ok = graphene.Boolean()
    project = graphene.Field(lambda: ProjectType)

    class Arguments:
        project_id = graphene.Int(required=True)
        title = graphene.String()
        user_id = graphene.Int()

    def mutate(self, info, project_id, **kwargs):
        print(kwargs)
        ok = True
        Project.objects.filter(id=project_id).update(**kwargs)
        project = Project.objects.get(id=project_id)
        return UpdateProject(project=project, ok=ok)


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class UserType(DjangoObjectType):
    class Meta:
        model = User


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    delete_project = DeleteProject.Field()
    update_project = UpdateProject.Field()


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
