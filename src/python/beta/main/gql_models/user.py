import graphene

from graphene_django.types import DjangoObjectType
from django.contrib.auth.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User


class CreateUser(graphene.Mutation):
    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=False)

    def mutate(self, info, username, password):
        user = User(username=username, password=password)
        user.save()
        ok = True
        return CreateUser(user=user, ok=ok)
