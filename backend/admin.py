from django.contrib import admin
from .models import Competitions,Leagues, Predictions,UserProfile,ActionToken,Sitestats,LogIps

# Register your models here.
admin.site.register(Competitions)
admin.site.register(Leagues)
admin.site.register(Predictions)
admin.site.register(UserProfile)
admin.site.register(ActionToken)
admin.site.register(Sitestats)
admin.site.register(LogIps)



