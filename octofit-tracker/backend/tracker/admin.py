from django.contrib import admin

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout

admin.site.register(Team)
admin.site.register(UserProfile)
admin.site.register(Workout)
admin.site.register(Activity)
admin.site.register(LeaderboardEntry)
