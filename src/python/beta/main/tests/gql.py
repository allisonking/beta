"""
Adapted from https://www.sam.today/blog/testing-graphql-with-graphene-django/
"""

import json
from django.test import TestCase
from django.test import Client

# Inherit from this in your test cases


class GraphQLTestCase(TestCase):

    def setUp(self):
        self._client = Client()

    def query(self, query: str, op_name: str = None, variables: dict = None):
        '''
        Args:
            query (string) - GraphQL query to run
            op_name (string) - If the query is a mutation or named query, you must
                               supply the op_name.  For annon queries ("{ ... }"),
                               should be None (default).
            variables (dict) - If provided, the $variables variable in GraphQL will be set
                           to this value

        Returns:
            dict, response from graphql endpoint.  The response has the "data" key.
                  It will have the "error" key if any error happened.
        '''
        body = {'query': query}
        if op_name:
            body['operation_name'] = op_name
        if variables:
            body['variables'] = variables

        resp = self._client.post('/graphql', json.dumps(body),
                                 content_type='application/json')
        jresp = json.loads(resp.content.decode())

        return jresp

    def assertResponseNoErrors(self, resp: dict):
        '''
        Assert that the resp (as returned from query) did not throw an error
        '''
        self.assertNotIn('errors', resp, 'Response had errors')
        #self.assertEqual(resp['data'], expected, 'Response has correct data')
