from main.tests.gql import GraphQLTestCase
from django.contrib.auth.models import User
from main.models import Project, Chapter, Comment


class CommentTestCase(GraphQLTestCase):
    def seed_data(self):
        user = self.seed_user("jkrowling")
        project = self.seed_project(user=user)
        chapter = self.seed_chapter(project=project)
        other_user = self.seed_user("commenter")
        Comment.objects.create(chapter=chapter, commenter=other_user,
                               text="cool!", reference_start=0, reference_end=100)
        Comment.objects.create(chapter=chapter, commenter=other_user,
                               text="spelling mistake", reference_start=50, reference_end=200)
        Comment.objects.create(chapter=chapter, commenter=other_user,
                               text="awk", reference_start=1230, reference_end=1400)

    def seed_user(self, name):
        user = User.objects.create_user(username=name)
        return user

    def seed_project(self, user):
        return Project.objects.create(title="harry potter", user=user)

    def seed_chapter(self, project):
        return Chapter.objects.create(project=project)

    def test_get_comments(self):
        self.seed_data()
        q = '''
        { allComments {
            id
            text
            chapter {
                project {
                    title
                }
            }
        }}
        '''
        resp = self.query(q)
        data = resp['data']['allComments']
        # check we have the right number returned
        self.assertEqual(len(data), 3)

        # check that the text is right
        texts = [d['text'] for d in data]
        self.assertEqual(sorted(texts), ['awk', 'cool!', 'spelling mistake'])

        # check that they all belong to the right project
        for d in data:
            self.assertEqual(d['chapter']['project']['title'], 'harry potter')

    def test_delete_comment(self):
        self.seed_data()
        q = '''
        mutation($commentId:Int!) {
            deleteComment(commentId:$commentId) {
                ok
            }
        }
        '''
        comment = Comment.objects.first()
        count = Comment.objects.count()
        resp = self.query(q, op_name='deleteComment',
                          variables={'commentId': comment.id})
        self.assertResponseNoErrors(resp)
        self.assertEqual(Comment.objects.count(), count-1)

    def test_create_comment(self):
        self.seed_data()
        chapter = Chapter.objects.first()
        user = User.objects.first()
        count = Comment.objects.count()
        q = '''
        mutation($chapterId:Int!, $userId: Int!) {
            createComment(chapterId:$chapterId, userId:$userId, text:"cry", referenceStart:0, referenceEnd:15, tags:["emotion", "character"]) {
                ok
                comment {
                    text
                    tags
                }
            }
        }
        '''
        resp = self.query(q, op_name="createComment",
                          variables={'chapterId': chapter.id, 'userId': user.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['createComment']['comment']
        self.assertEqual(Comment.objects.count(), count+1)
        self.assertEqual(data['text'], 'cry')
        self.assertEqual(data['tags'], ['emotion', 'character'])

    def test_update_comment(self):
        self.seed_data()
        comment = Comment.objects.first()
        q = '''
        mutation($commentId:Int!) {
            updateComment(commentId:$commentId, text:"this is VERY beautiful", tags:["emotion"]) {
                ok
                comment {
                    text
                    tags
                }
            }
        }
        '''
        resp = self.query(q, op_name="updateComment",
                          variables={'commentId': comment.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['updateComment']['comment']
        self.assertEqual(data['text'], 'this is VERY beautiful')
        self.assertEqual(data['tags'], ["emotion"])
