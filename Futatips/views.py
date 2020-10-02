from django.http import HttpResponse,request
from django.shortcuts import render
from backend.models import *
from django.core.exceptions import ObjectDoesNotExist,MultipleObjectsReturned
from datetime import date,timedelta,datetime
def logip(ip):
    newip = LogIps()
    newip.visitor_ip=ip
    newip.save()

def indexpage(request):

    try:
        logip(request.META.get('REMOTE_ADDR'))
        top_leaague =['English Premier League','Germany Bundesliga','Laliga','Italy Seria A']
        tips = Predictions.objects.filter(kickoff_date=date.today())
        totaltips = Predictions.objects.filter(kickoff_date=date.today()).count()
        topgames = Predictions.objects.filter(league__in=top_leaague,
                                              kickoff_date__range=(date.today(), date.today() + timedelta(days=7)),
                                              prediction_one_odds__range = ('1.0','1.7'))

        if totaltips>5:
             context = {'predictions': tips,'topgames':topgames,'topleagues':top_leaague}
        else:
            alltips =Predictions.objects.filter(kickoff_date__range=(date.today(), date.today() +timedelta(days=7)))[0:20]
            context = {'predictions': alltips,'topgames':topgames,'topleagues':top_leaague}
        return render(request, 'index.html',context)
    except:
        return  render(request,'NOT-FOUND.html',{"error":"Internal Server Error."})

def viewtip(request,match,kickoff):
    moregames = Predictions.objects.filter(kickoff_date__range=(date.today(), date.today() + timedelta(days=7)))[0:7]
    try:
     logip(request.META.get('REMOTE_ADDR'))
     game = Predictions.objects.get(game_title=match,kickoff_date=kickoff)
     Predictions.objects.filter(game_title=match, kickoff_date=kickoff).update(view_count=int(game.view_count)+1)
     context={'game':game,'moregames':moregames}
     return  render(request,'view-prediction.html',context)
    except ObjectDoesNotExist or MultipleObjectsReturned:
     return  render(request,'NOT-FOUND.html',{"error":"Match Not Found."})
    except:
     return  render(request,'NOT-FOUND.html',{"error":"Internal Server Error."})
def accumulators(request):
    today_games = Predictions.objects.filter(kickoff_date=date.today())
    try:
      logip(request.META.get('REMOTE_ADDR'))
      upcomming_games = Predictions.objects.filter(kickoff_date__range=(date.today(), date.today() + timedelta(days=7)))[0:7]
      print(today_games.count())
      if today_games.count()<1:
          context = {'tips': upcomming_games,'date':'Upcoming'}
      else:
          context = {'tips': today_games,'date':date.today()}

      return  render(request,'accumulator.html',context)
    except:
        return  render(request,'NOT-FOUND.html',{"error":"Internal Server Error."})
def authers(request):
    return render(request,'authers.html')

def filtered(request,query):
    logip(request.META.get('REMOTE_ADDR'))
    if query=='Leagues':
        try:
         if request.GET.get('q')==None:
          leagues = Leagues.objects.all()
          return render(request, 'filtered.html',{'filteres':leagues,'category':query})
         else:
           try:
               allgames =Predictions.objects.filter(league__icontains=request.GET.get('q')[0:-1])

               return render(request, 'filtered.html', {'games': allgames, 'category': 'League_filtered'})
           except ObjectDoesNotExist:
               return  render(request,'NOT-FOUND.html',{"error":"Match could not be Found."})
           except Exception as e:

               return  render(request,'NOT-FOUND.html',{"error":"Internal Server Error."})


        except:
          return  render(request,'NOT-FOUND.html',{"error":"Internal Server Error."})

    else:
        return  render(request,'NOT-FOUND.html',{"error":"Action not allowed."})

def about(request):
    logip(request.META.get('REMOTE_ADDR'))
    return  render(request,'about.html')

def notfound(request):
    logip(request.META.get('REMOTE_ADDR'))
    return  render(request,'NOT-FOUND.html',{"error":"The Requested Resource Could Not be Found."})