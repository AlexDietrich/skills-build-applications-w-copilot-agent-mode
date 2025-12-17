from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from pymongo import MongoClient

from tracker.models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Resetting collections...')
        Activity.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Workout.objects.all().delete()
        UserProfile.objects.all().delete()
        Team.objects.all().delete()

        teams = self._create_teams()
        workouts = self._create_workouts()
        users = self._create_users(teams)
        self._create_activities(users, teams, workouts)
        self._create_leaderboard(teams)

        self._ensure_unique_email_index()
        self.stdout.write(self.style.SUCCESS('Database populated with sample data.'))

    def _create_teams(self):
        teams = {
            'Marvel': Team.objects.create(name='Marvel', description='Team Marvel super heroes'),
            'DC': Team.objects.create(name='DC', description='Team DC super heroes'),
        }
        self.stdout.write('Created teams: Marvel, DC')
        return teams

    def _create_workouts(self):
        workouts = {
            'HIIT Blast': Workout.objects.create(
                title='HIIT Blast',
                description='High intensity interval training for explosive power.',
                difficulty='Hard',
                duration_minutes=35,
                focus_area='Full Body',
            ),
            'Strength Circuit': Workout.objects.create(
                title='Strength Circuit',
                description='Compound lifts and accessory strength moves.',
                difficulty='Medium',
                duration_minutes=45,
                focus_area='Strength',
            ),
            'Recovery Flow': Workout.objects.create(
                title='Recovery Flow',
                description='Mobility and stretching to recover from battles.',
                difficulty='Easy',
                duration_minutes=25,
                focus_area='Mobility',
            ),
            'Endurance Run': Workout.objects.create(
                title='Endurance Run',
                description='Steady-state cardio session.',
                difficulty='Medium',
                duration_minutes=50,
                focus_area='Cardio',
            ),
        }
        self.stdout.write(f"Created {len(workouts)} workouts")
        return workouts

    def _create_users(self, teams):
        user_specs = [
            ('Tony Stark', 'tony@marvel.com', 'Marvel', 'Leader'),
            ('Steve Rogers', 'steve@marvel.com', 'Marvel', 'Captain'),
            ('Natasha Romanoff', 'natasha@marvel.com', 'Marvel', 'Agent'),
            ('Bruce Wayne', 'bruce@dc.com', 'DC', 'Strategist'),
            ('Diana Prince', 'diana@dc.com', 'DC', 'Warrior'),
            ('Barry Allen', 'barry@dc.com', 'DC', 'Speedster'),
        ]
        users = {}
        for name, email, team_name, role in user_specs:
            users[name] = UserProfile.objects.create(
                name=name,
                email=email,
                team=teams[team_name],
                role=role,
            )
        self.stdout.write(f"Created {len(users)} users")
        return users

    def _create_activities(self, users, teams, workouts):
        now = timezone.now()
        activity_specs = [
            ('Tony Stark', 'Marvel', 'HIIT Blast', 35, 420, 1, 'High'),
            ('Steve Rogers', 'Marvel', 'Strength Circuit', 45, 380, 2, 'Medium'),
            ('Natasha Romanoff', 'Marvel', 'Recovery Flow', 25, 180, 1, 'Low'),
            ('Bruce Wayne', 'DC', 'Strength Circuit', 50, 410, 0, 'High'),
            ('Diana Prince', 'DC', 'Endurance Run', 55, 500, 3, 'High'),
            ('Barry Allen', 'DC', 'HIIT Blast', 30, 460, 0, 'High'),
        ]
        for name, team_name, workout_title, duration, calories, days_ago, intensity in activity_specs:
            Activity.objects.create(
                user=users[name],
                team=teams[team_name],
                workout=workouts[workout_title],
                performed_at=now - timedelta(days=days_ago),
                duration_minutes=duration,
                calories_burned=calories,
                intensity=intensity,
                notes=f"{workout_title} session by {name}",
            )
        self.stdout.write(f"Created {len(activity_specs)} activities")

    def _create_leaderboard(self, teams):
        leaderboard_specs = [
            (teams['Marvel'], 3400, 1),
            (teams['DC'], 3100, 2),
        ]
        for team, points, rank in leaderboard_specs:
            LeaderboardEntry.objects.create(team=team, total_points=points, rank=rank)
        self.stdout.write('Created leaderboard entries for Marvel and DC')

    def _ensure_unique_email_index(self):
        client = MongoClient('mongodb://127.0.0.1:27017')
        collection = client['octofit_db']['tracker_userprofile']
        collection.create_index('email', unique=True)
        client.close()
        self.stdout.write('Ensured unique index on email field for users')