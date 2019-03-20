from main.tests.gql import GraphQLTestCase
from django.contrib.auth.models import User


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
        # we should still have the same number of users, but one should be inactive
        self.assertEqual(User.objects.count(), count)
        self.assertFalse(User.objects.get(username="tolkien").is_active)

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
        self.assertFalse(User.objects.get(id=user.id).is_active)

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
