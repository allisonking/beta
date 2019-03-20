from main.tests.gql import GraphQLTestCase
from django.contrib.auth.models import User
from main.models import Project, Chapter


class ChapterTestCase(GraphQLTestCase):
    def seed_data(self):
        user = self.seed_user()
        project = self.seed_project(user=user)
        Chapter.objects.create(
            project=project, chapter_text="mr and mrs dursley, of number four privet drive...")
        Chapter.objects.create(
            project=project, chapter_text="you are a wizard!")
        Chapter.objects.create(
            project=project, chapter_text="after all this time?")

    def seed_user(self):
        user = User.objects.create_user(username="jkrowling")
        return user

    def seed_project(self, user):
        return Project.objects.create(title="harry potter", user=user)

    def test_get_chapters(self):
        self.seed_data()
        q = '''
        { allChapters {
            id
            chapterText
            project {
                title
            }
        }}
        '''
        resp = self.query(q)
        data = resp['data']['allChapters']
        # check we have the right number returned
        self.assertEqual(len(data), 3)

        # check that the text is right
        texts = [d['chapterText'] for d in data]
        self.assertEqual(
            sorted(texts), ['after all this time?',
                            "mr and mrs dursley, of number four privet drive...",
                            'you are a wizard!'])

        # check that they all belong to the right project
        for d in data:
            self.assertEqual(d['project']['title'], 'harry potter')

    def test_delete_chapter(self):
        self.seed_data()
        q = '''
        mutation($chapterId:Int!) {
            deleteChapter(chapterId:$chapterId) {
                ok
            }
        }
        '''
        chapter = Chapter.objects.first()
        count = Chapter.objects.count()
        resp = self.query(q, op_name='deleteChapter',
                          variables={'chapterId': chapter.id})
        self.assertResponseNoErrors(resp)
        self.assertEqual(Chapter.objects.count(), count-1)

    def test_create_chapter(self):
        project = self.seed_project(user=self.seed_user())
        q = '''
        mutation($projectId:Int!) {
            createChapter(projectId:$projectId, title:"the boy who lived", chapterText:"cat woman") {
                ok
                chapter {
                    title
                    chapterText
                }
            }
        }
        '''
        resp = self.query(q, op_name="createChapter",
                          variables={'projectId': project.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['createChapter']['chapter']
        self.assertEqual(Chapter.objects.count(), 1)
        self.assertEqual(data['title'], 'the boy who lived')
        self.assertEqual(data['chapterText'], 'cat woman')

    def test_update_chapter(self):
        self.seed_data()
        chapter = Chapter.objects.first()
        q = '''
        mutation($chapterId:Int!) {
            updateChapter(chapterId:$chapterId, title:"the boy who partied", version:2, orderNum:3) {
                ok
                chapter {
                    title
                    version
                    orderNum
                }
            }
        }
        '''
        resp = self.query(q, op_name="updateChapter",
                          variables={'chapterId': chapter.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['updateChapter']['chapter']
        self.assertEqual(data['title'], 'the boy who partied')
        self.assertEqual(data['version'], 2)
        self.assertEqual(data['orderNum'], 3)
