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
        first_name = graphene.String()
        last_name = graphene.String()
        email = graphene.String()
        is_staff = graphene.Boolean()
        is_active = graphene.Boolean()

    def mutate(self, info, username, password, **kwargs):
        user = User.objects.create(username=username, **kwargs)
        user.set_password(password)  # hashes the password
        user.save()
        ok = True
        return CreateUser(user=user, ok=ok)


class DeleteUser(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        user_id = graphene.Int()
        username = graphene.String()

    def mutate(self, info, **kwargs):
        user = None
        user_id = kwargs.get('user_id')
        username = kwargs.get('username')
        if not (username or user_id):
            raise Exception('could not get user object from given arguments')
        if user_id:
            user = User.objects.get(id=user_id)
        elif kwargs.get('username'):
            user = User.objects.get(username=username)
        user.delete()
        ok = True
        return DeleteUser(ok=ok)


class UpdateUser(graphene.Mutation):
    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserType)

    class Arguments:
        user_id = graphene.Int(required=True)
        username = graphene.String()
        password = graphene.String()
        first_name = graphene.String()
        last_name = graphene.String()
        email = graphene.String()
        is_staff = graphene.Boolean()
        is_active = graphene.Boolean()
        date_joined = graphene.DateTime()

    def mutate(self, info, user_id, **kwargs):
        ok = True
        userset = User.objects.filter(id=user_id)
        userset.update(**kwargs)
        user = userset[0]
        if 'password' in kwargs:
            user.set_password(kwargs['password'])
            user.save()

        return UpdateUser(user=user, ok=ok)
