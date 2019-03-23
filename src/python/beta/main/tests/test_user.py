from main.tests.gql import GraphQLTestCase
from django.contrib.auth.models import User
from main.models import Project, Chapter, Comment


class UserTestCase(GraphQLTestCase):
    def seed_data(self):
        User.objects.create_user(username="jkrowling",
                                 email="jkr@hogwarts.edu")
        User.objects.create_user(
            username="tolkien", email="youhavemyaxe@shire.com")
        User.objects.create_user(username="ruthozeki",
                                 email="meatpotato@email.com")

    def test_get_users(self):
        self.seed_data()
        q = '''
        { allUsers {
            id
            username
            isSuperuser
            email
        }}
        '''
        resp = self.query(q)
        data = resp['data']['allUsers']
        # check we have the right number returned
        self.assertEqual(len(data), 3)

        # check that our usernames are right
        titles = [d['username'] for d in data]
        self.assertEqual(
            sorted(titles), ['jkrowling', "ruthozeki", 'tolkien'])

    def test_delete_user(self):
        self.seed_data()
        # delete by username
        q = '''
        mutation {
            deleteUser(username:"tolkien") {
                ok
            }
        }
        '''
        count = User.objects.count()
        resp = self.query(q, op_name='deleteUser')
        self.assertResponseNoErrors(resp)
        self.assertEqual(User.objects.count(), count-1)

        # delete by user ID
        q = '''
        mutation($userId:Int!) {
            deleteUser(userId:$userId) {
                ok
            }
        }
        '''
        user = User.objects.first()
        resp = self.query(q, op_name='deleteUser',
                          variables={'userId': user.id})
        self.assertResponseNoErrors(resp)
        self.assertEqual(User.objects.count(), count-2)

    def test_create_user(self):
        q = '''
        mutation {
            createUser(username:"grrmartin", password:"rpluslequalsj", email:"winter@winterfell.com") {
                ok
                user {
                    id
                    username
                    password
                    email
                }
            }
        }
        '''
        resp = self.query(q, op_name="createUser")

        self.assertResponseNoErrors(resp)
        data = resp['data']['createUser']['user']
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(data['username'], 'grrmartin')
        self.assertEqual(data['email'], 'winter@winterfell.com')
        # make sure password got hashed
        self.assertNotEqual(data['password'], 'rpluslequalsj')
        self.assertTrue('sha256' in data['password'])

    def test_update_user(self):
        self.seed_data()
        user = User.objects.first()
        q = '''
        mutation($userId:Int!) {
            updateUser(userId:$userId, email:"headmaster@hogwarts.edu", password:"alohomora") {
                ok
                user {
                    email
                    password
                }
            }
        }
        '''
        resp = self.query(q, op_name="updateUser",
                          variables={'userId': user.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['updateUser']['user']
        self.assertEqual(data['email'], 'headmaster@hogwarts.edu')
        self.assertNotEqual(data['password'], 'alohomora')
        self.assertTrue('sha256' in data['password'])

    def test_delete_cascades(self):
        user1 = User.objects.create_user(username="jkrowling")
        user2 = User.objects.create_user(username="grrmartin")
        project = Project.objects.create(user=user1, title='harry potter')
        chapter1 = Chapter.objects.create(
            project=project, chapter_text="yer a wizard")
        chapter2 = Chapter.objects.create(
            project=project, chapter_text="a what?")
        Comment.objects.create(chapter=chapter1, commenter=user2,
                               text="how about adding some DEATH", reference_start=1, reference_end=3)
        Comment.objects.create(chapter=chapter2, commenter=user2,
                               text="could use more sarcastic comments", reference_start=2, reference_end=4)
        q = '''
        mutation($username: String!) {
            deleteUser(username:$username) {
                ok
            }
        }
        '''
        resp = self.query(q, op_name='deleteUser', variables={
                          'username': 'grrmartin'})
        self.assertResponseNoErrors(resp)

        # grrmartin's comments should still be there
        all_comments = Comment.objects.all()
        self.assertEqual(len(all_comments), 2)
        # but his name shouldn't be associated with it anymore
        [self.assertIsNone(comment.commenter) for comment in all_comments]

        # deleting jkr should delete everything
        resp = self.query(q, op_name='deleteUser', variables={
                          'username': 'jkrowling'})
        self.assertEqual(len(Project.objects.all()), 0)
        self.assertEqual(len(Chapter.objects.all()), 0)
        self.assertEqual(len(Comment.objects.all()), 0)
        self.assertEqual(len(User.objects.all()), 0)
