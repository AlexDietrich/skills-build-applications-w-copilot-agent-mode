from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, related_name='members', on_delete=models.CASCADE)
    role = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.email})"


class Workout(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    difficulty = models.CharField(max_length=20)
    duration_minutes = models.PositiveIntegerField()
    focus_area = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class Activity(models.Model):
    user = models.ForeignKey(UserProfile, related_name='activities', on_delete=models.CASCADE)
    team = models.ForeignKey(Team, related_name='activities', on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, related_name='activities', on_delete=models.SET_NULL, null=True, blank=True)
    performed_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()
    intensity = models.CharField(max_length=30, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.user.name} - {self.workout.title if self.workout else 'Activity'}"


class LeaderboardEntry(models.Model):
    team = models.ForeignKey(Team, related_name='leaderboard_entries', on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.team.name} - {self.total_points} pts"
