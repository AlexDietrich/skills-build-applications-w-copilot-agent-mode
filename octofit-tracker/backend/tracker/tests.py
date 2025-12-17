from rest_framework import status
from rest_framework.test import APITestCase


class ApiRootTests(APITestCase):
	def test_root_endpoint_lists_resources(self):
		response = self.client.get('/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		for key in ['users', 'teams', 'activities', 'workouts', 'leaderboard']:
			self.assertIn(key, response.data)

	def test_api_endpoint_alias_lists_resources(self):
		response = self.client.get('/api/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
