from main.tests.gql import GraphQLTestCase
from django.contrib.auth.models import User
from main.models import Project


class ProjectTestCase(GraphQLTestCase):
    def seed_data(self):
        user = self.seed_user()
        Project.objects.create(title="harry potter", user=user)
        Project.objects.create(title="casual vacancy", user=user)
        Project.objects.create(title="cuckoo's calling", user=user)

    def seed_user(self):
        user = User.objects.create_user(username="jkrowling")
        return user

    def test_get_projects(self):
        self.seed_data()
        q = '''
        { allProjects {
            id
            title
            user {
                username
            }
        }}
        '''
        resp = self.query(q)
        data = resp['data']['allProjects']
        # check we have the right number returned
        self.assertEqual(len(data), 3)

        # check that our titles are right
        titles = [d['title'] for d in data]
        self.assertEqual(
            sorted(titles), ['casual vacancy', "cuckoo's calling", 'harry potter'])

        # check that they all belong to the right user
        for d in data:
            self.assertEqual(d['user']['username'], 'jkrowling')

    def test_delete_project(self):
        self.seed_data()
        project = Project.objects.first()
        q = '''
        mutation($projectId:Int!) {
            deleteProject(projectId:$projectId) {
                ok
            }
        }
        '''
        count = Project.objects.count()
        resp = self.query(q, op_name='deleteProject',
                          variables={'projectId': project.id})
        self.assertResponseNoErrors(resp)
        self.assertEqual(Project.objects.count(), count-1)

    def test_create_project(self):
        user = self.seed_user()
        q = '''
        mutation($userId:Int!) {
            createProject(title:"new project", userId:$userId) {
                ok
                project {
                    title
                }
            }
        }
        '''
        resp = self.query(q, op_name="createProject",
                          variables={'userId': user.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['createProject']['project']
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(data['title'], 'new project')

    def test_update_project(self):
        self.seed_data()
        project = Project.objects.first()
        q = '''
        mutation($projectId:Int!) {
            updateProject(projectId:$projectId, title:"ron weasley") {
                ok
                project {
                    title
                }
            }
        }
        '''
        resp = self.query(q, op_name="updateProject",
                          variables={'projectId': project.id})
        self.assertResponseNoErrors(resp)
        data = resp['data']['updateProject']['project']['title']
        self.assertEqual(data, 'ron weasley')
