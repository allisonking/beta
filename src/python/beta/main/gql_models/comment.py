import graphene

from graphene_django.types import DjangoObjectType
from main.models import Project, Chapter, Comment
from django.contrib.auth.models import User


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class CreateComment(graphene.Mutation):
    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentType)

    class Arguments:
        chapter_id = graphene.Int()
        user_id = graphene.Int()
        text = graphene.String()
        reference_start = graphene.Int()
        reference_end = graphene.Int()
        tags = graphene.List(graphene.String)

    def mutate(self, info, chapter_id, user_id, text, reference_start, reference_end, **kwargs):
        chapter = Chapter.objects.get(pk=chapter_id)
        user = User.objects.get(pk=user_id)
        comment = Comment.objects.create(
            chapter=chapter,
            commenter=user,
            text=text,
            reference_start=reference_start,
            reference_end=reference_end,
            **kwargs
        )
        ok = True
        return CreateComment(comment=comment, ok=ok)


class DeleteComment(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        comment_id = graphene.Int()

    def mutate(self, info, comment_id):
        Comment.objects.filter(id=comment_id).delete()
        ok = True
        return DeleteComment(ok=ok)


class UpdateComment(graphene.Mutation):
    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentType)

    class Arguments:
        comment_id = graphene.Int()
        chapter_id = graphene.Int()
        user_id = graphene.Int()
        text = graphene.String()
        reference_start = graphene.Int()
        reference_end = graphene.Int()
        tags = graphene.List(graphene.String)

    def mutate(self, info, comment_id, **kwargs):
        ok = True
        Comment.objects.filter(id=comment_id).update(**kwargs)
        comment = Comment.objects.get(id=comment_id)
        return UpdateComment(comment=comment, ok=ok)
