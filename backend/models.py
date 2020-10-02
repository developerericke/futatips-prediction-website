from django.db import models
from  datetime import date
from  django.utils.timezone import now
from django.contrib.auth.models import User
# Create your models here.
class Competitions(models.Model):
    country = models.CharField(max_length=20,primary_key=True,unique=True)

    def __str__(self):
        return self.country


class Leagues(models.Model):
    league = models.CharField(max_length=30,unique=True,primary_key=True)
    country = models.ForeignKey(Competitions,on_delete=models.CASCADE)
    league_icon = models.CharField(max_length=30)

    def __str__(self):
        return self.league

class Predictions (models.Model):
    country = models.CharField(max_length=30)
    game_title = models.SlugField(default="team1-vs-team2")
    league= models.CharField(max_length=20)
    match = models.CharField(max_length=50)
    kickoff_date = models.CharField(max_length=40)
    kickoff_time = models.CharField(max_length=10)
    match_image = models.CharField(max_length=40,default='DEFAULT_IMAGE')
    prediction_one_type = models.CharField(max_length=40)
    prediction_one_value = models.CharField(max_length=30)
    prediction_one_odds = models.CharField(max_length=4)
    prediction_two_type = models.CharField(max_length=40,default='Non-Provided',null=False,blank=False)
    prediction_two_value = models.CharField(max_length=30,default='Non-Provided',null=False,blank=False)
    prediction_two_odds = models.CharField(max_length=4,default='Non-Provided')
    prediction_three_type = models.CharField(max_length=40,default='Non-Provided')
    prediction_three_value = models.CharField(max_length=30,default='Non-Provided')
    prediction_three_odds = models.CharField(max_length=4,default='Non-Provided')
    venue = models.CharField(max_length=40,default='Non-Provided')
    match_overview = models.TextField(default='Non-Provided')
    team_one_mp = models.CharField(max_length=200,default='Non-Provided')
    team_two_mp = models.CharField(max_length=200,default='Non-Provided')
    team_one_fm_gm1 = models.CharField(max_length=40,default='Non-Provided') ; team_one_fm_gm2 = models.CharField(max_length=40,default='Non-Provided') ;
    team_one_fm_gm3 = models.CharField(max_length=40,default='Non-Provided')
    team_one_fm_gm4 = models.CharField(max_length=40,default='Non-Provided') ; team_one_fm_gm5 = models.CharField(max_length=40,default='Non-Provided')
    team_two_fm_gm1 = models.CharField(max_length=40,default='Non-Provided')
    team_two_fm_gm2 = models.CharField(max_length=40,default='Non-Provided')
    team_two_fm_gm3 = models.CharField(max_length=40,default='Non-Provided')
    team_two_fm_gm4 = models.CharField(max_length=40,default='Non-Provided')
    team_two_fm_gm5 = models.CharField(max_length=40,default='Non-Provided')
    auther = models.ForeignKey(User,on_delete=models.SET('admin'))
    date = models.CharField(max_length=100,default=date.today())
    referee = models.CharField(max_length=100,default='Non-Provided')
    teamone = models.CharField(max_length=50,default='Non-Provided')
    teamtwo = models.CharField(max_length=50,default='Non-Provided')
    view_count = models.CharField(max_length=300,default=0)

    def __str__(self):
       return self.match

    def getViews(self):
        return self.view_count
    def modelsnippet(self):
        return self.match_overview[0:150]+'...'


class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)

    fullnames = models.CharField(max_length=255)
    avatar = models.CharField(max_length=255)
    auther_name = models.CharField(max_length=255)

    def __str__(self):
        return self.fullnames

class ActionToken(models.Model):
     action= models.CharField(max_length=50,default='Verification')
     account =models.EmailField()
     state = models.CharField(max_length=50,default='Active')
     token = models.CharField(max_length=200)


     def __str__(self):
         return self.account


class Sitestats(models.Model):
    STATS_ID=models.CharField(max_length=200,default='SITE_STATS')
    total_visitors = models.CharField(max_length=100,default=0)
    unique_visitors = models.CharField(max_length=100,default=0)
    returning_visitors = models.CharField(max_length=100,default=0)

    def __str__(self):
        return self.total_visitors

    def view_total_visitors(self):
        return self.total_visitors

    def view_unique_visitors(self):
        return self.unique_visitors

    def view_returning_visitors(self):
        return self.returning_visitors


class LogIps(models.Model):
     visitor_ip = models.CharField(max_length=300)
     visit_date = models.DateField(auto_now=True)

     def __str__(self):
         return self.visitor_ip

