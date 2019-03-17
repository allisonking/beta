import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project
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
        ok = True
        Project.objects.filter(id=project_id).update(**kwargs)
        project = Project.objects.get(id=project_id)
        return UpdateProject(project=project, ok=ok)
