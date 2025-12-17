from bson import ObjectId
from rest_framework import serializers

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class ObjectIdSerializerMixin(serializers.ModelSerializer):
    def _to_string(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for key, value in data.items():
            if isinstance(value, list):
                data[key] = [self._to_string(item) for item in value]
            else:
                data[key] = self._to_string(value)
        return data


class TeamSerializer(ObjectIdSerializerMixin):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProfileSerializer(ObjectIdSerializerMixin):
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'team', 'role', 'is_active', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class WorkoutSerializer(ObjectIdSerializerMixin):
    class Meta:
        model = Workout
        fields = ['id', 'title', 'description', 'difficulty', 'duration_minutes', 'focus_area', 'created_at']
        read_only_fields = ['id', 'created_at']


class ActivitySerializer(ObjectIdSerializerMixin):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    workout = serializers.PrimaryKeyRelatedField(queryset=Workout.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Activity
        fields = [
            'id',
            'user',
            'team',
            'workout',
            'performed_at',
            'duration_minutes',
            'calories_burned',
            'intensity',
            'notes',
        ]
        read_only_fields = ['id']


class LeaderboardEntrySerializer(ObjectIdSerializerMixin):
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'team', 'total_points', 'rank', 'updated_at']
        read_only_fields = ['id', 'updated_at']