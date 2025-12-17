"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from tracker import views as tracker_views

router = routers.DefaultRouter()
router.register('users', tracker_views.UserProfileViewSet, basename='userprofile')
router.register('teams', tracker_views.TeamViewSet, basename='team')
router.register('activities', tracker_views.ActivityViewSet, basename='activity')
router.register('workouts', tracker_views.WorkoutViewSet, basename='workout')
router.register('leaderboard', tracker_views.LeaderboardEntryViewSet, basename='leaderboardentry')

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

@api_view(['GET'])
def api_root(request, format=None):
    return Response(
        {
            'users': f"{base_url}{reverse('userprofile-list', request=None, format=format)}",
            'teams': f"{base_url}{reverse('team-list', request=None, format=format)}",
            'activities': f"{base_url}{reverse('activity-list', request=None, format=format)}",
            'workouts': f"{base_url}{reverse('workout-list', request=None, format=format)}",
            'leaderboard': f"{base_url}{reverse('leaderboardentry-list', request=None, format=format)}",
        }
    )

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/', include(router.urls)),
]
