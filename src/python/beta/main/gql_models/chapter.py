import graphene

from graphene_django.types import DjangoObjectType
from main.models import Chapter, Project
from django.contrib.auth.models import User


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter


class CreateChapter(graphene.Mutation):
    ok = graphene.Boolean()
    chapter = graphene.Field(lambda: ChapterType)

    class Arguments:
        project_id = graphene.Int()
        title = graphene.String()
        chapter_text = graphene.String()
        order_num = graphene.Int()
        version = graphene.Int()

    def mutate(self, info, project_id, chapter_text, **kwargs):
        project = Project.objects.get(pk=project_id)
        chapter = Chapter.objects.create(
            project=project, chapter_text=chapter_text, **kwargs)
        ok = True
        return CreateChapter(chapter=chapter, ok=ok)


class DeleteChapter(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        chapter_id = graphene.Int()

    def mutate(self, info, chapter_id):
        Chapter.objects.filter(id=chapter_id).delete()
        ok = True
        return DeleteChapter(ok=ok)


class UpdateChapter(graphene.Mutation):
    ok = graphene.Boolean()
    chapter = graphene.Field(lambda: ChapterType)

    class Arguments:
        chapter_id = graphene.Int()
        project_id = graphene.Int()
        title = graphene.String()
        chapter_text = graphene.String()
        order_num = graphene.Int()
        version = graphene.Int()

    def mutate(self, info, chapter_id, **kwargs):
        ok = True
        Chapter.objects.filter(id=chapter_id).update(**kwargs)
        chapter = Chapter.objects.get(id=chapter_id)
        return UpdateChapter(chapter=chapter, ok=ok)
