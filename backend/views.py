from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist,MultipleObjectsReturned
from django.http import request,HttpResponse,HttpResponseRedirect
from backend.models import Competitions,Leagues,Predictions,ActionToken,Sitestats,LogIps
from django.contrib.auth import login,logout
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm,PasswordResetForm,PasswordChangeForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from  django.utils.crypto import get_random_string

import os

from mailjet_rest import Client
api_key = os.getenv("Mailjetkey")
api_secret = os.getenv("Mailjetsecret")
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
# Create your views here.

def login_user(request):
    if(request.method=='GET'):
      return render(request,'admins/authenticate.html')
    elif request.method=='POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
           user = form.get_user()
           login(request,user)
           return HttpResponse(status=200,content="Success")
        else:
           return HttpResponse(status=400,content="Incorrect Username and Password Combinations.")
def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/admins/login/')
def registerUser(request):
    #check verification token from verification model
    try:
        ActionToken.objects.get(token=request.headers.get('Verification-Token'),state='Active')

        form = UserCreationForm(request.POST)

        try:
            # check username to ensure it does not exist
            User.objects.get(username=request.POST.get('username'))

            return HttpResponse(status=400, content="Username already Taken")
        except ObjectDoesNotExist:
            # username is available for use
            try:
                form.save()
                tokenemail = ActionToken.objects.get(token=request.headers.get('Verification-Token'))
                User.objects.filter(username=request.POST.get('username')).update(email=tokenemail.account)

                ActionToken.objects.filter(token=request.headers.get('Verification-Token'),state='Active').update(state='Expired')
                return HttpResponse(status=200, content="success")
            except Exception as e:
                return HttpResponse(status=400,
                                    content="Password must <br>"
                                            "-Contain  at least 8 characters and Include Letters and Numbers<br>"
                                            "-Not be too easy to guess (i.e not include 123)")
        except:
            return HttpResponse(status=500, content="Internal Server Error")
    except ObjectDoesNotExist:
            #Token is Invalid
            return HttpResponse(status=403,content="Bad or Expired Verification Token.Re-check your Email and Click on the correct link sent to you")
    except:
            return HttpResponse(status=500, content="Internal Server Error")

def resetpassword(request):
    return render(request,'admins/reset-password.html')

def verifiedemail(request):
    return  render(request,'admins/verified-emails.html')

@login_required(login_url='/admins/login/')
def dashboard(request):
    try:
        total_visitors = LogIps.objects.all().count()
        new_visitors = LogIps.objects.order_by('visitor_ip').values_list('visitor_ip',flat=True).distinct().count()
        ret_visitors = int(total_visitors) - int(new_visitors)

        t_preds = Predictions.objects.filter().count()

        t_views = 0
        for view_count in Predictions.objects.all():
            t_views = t_views + int(view_count.view_count)
        context={
            'user':request.user,'visits':total_visitors,'u_visitors':new_visitors,'r_visitors':ret_visitors,
            't_predictions':t_preds,'pred_views':t_views
        }

        return render(request, 'admins/admin.html',context)
    except:
        return render(request, 'admins/NOT-FOUND.html', {'error':'Internal Server Error'})


def addtip(request):
    if(request.method=='GET'):
        leagues= Leagues.objects.all()
        country = Competitions.objects.all()
        context ={'countries':country,'leagues':leagues}
        return  render(request,'admins/add-prediction.html',context)
    else:
        return HttpResponse(request,status=403,content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def viewprediction(request,match,kickoff):
    if request.method=='GET':
       try:

           tip =Predictions.objects.get(game_title=match,kickoff_date=kickoff,auther=request.user)
           if tip.auther == request.user:
             context={"tip":tip,'editable':True}
           else:
             context = {"tip": tip,'editable':False}


           return render(request, 'admins/detailed-prediction.html',context)
       except ObjectDoesNotExist:
           return render(request, 'admins/NOT-FOUND.html', {'error': match + ' not found'})
       except Exception as e:

           return render(request, 'admins/NOT-FOUND.html', {'error':'Internal Server Error'})

    else:
      return HttpResponse(status=403,content="Method Not allowed")

#view list of predictions
@login_required(login_url='/admins/login/')
def manageprediction(request):
    try:
        preds = Predictions.objects.filter(auther=request.user)
        context= {'predictions':preds}
        return render(request, 'admins/manage-prediction.html',context)
    except:
        return render(request, 'admins/NOT-FOUND.html', {'error': 'Internal Server Error'})

#manage users
@login_required(login_url='/admins/login/')
def manageusers(request):

    if(request.user.is_staff==True):
        try:
            allusers = User.objects.all()
            print(allusers)

            context = {'users':allusers}
            return render(request, 'admins/manage-users.html',context)
        except:
            return render(request, 'admins/NOT-FOUND.html', {'error': 'Internal Server Error'})

    else:
        return render(request, 'admins/NOT-FOUND.html', {'error': 'You do not have the Sufficient Privileges to manage users.'})


@login_required(login_url='/admins/login/')
def addtiper(request):
    if request.method == 'POST':
        try:
            User.objects.get(email=request.POST.get('email'))
            return HttpResponse(status=403, content="Account Already Exists")

        except ObjectDoesNotExist:
            randomtoken = get_random_string(length=35)

            #send email
            register_account_email = {
                'Messages': [
                    {
                        "From": {
                            "Email": "developer.ericke@gmail.com",
                            "Name": "FutaTips"
                        },
                        "To": [
                            {
                                "Email": request.POST.get('email'),
                                "Name": ""
                            }
                        ],
                        "Subject": "Set up your Account",
                        "HTMLPart": "<div style='text-align:center;font-weight:bolder;text-decoration:underline;font-size:x-large'>"
                                    "Welcome Aboard</div><br><br>"
                                    "<p>Hi there,<br> We have created an account for you at FutaTips.You can now be able to submit your football predictions as a writer."
                                    "<br>To get started, <a style='font-weight:bolder' href='https://futatips.herokuapp.com/admins/verified-email/?token="+randomtoken+"'> click here </a><<br /><br><br>"
                                    "If you are having issues while getting started with your new account,contact the system admin <br><br>"
                                    "<span style='text-decoration:italic'>Eric Nderitu,<br>Futatips Admin</span></p> "
                    }
                ]
            }
            try:
                result = mailjet.send.create(data=register_account_email)
                if result.status_code == 200:

                        #add token to db
                        newtoken = ActionToken()
                        newtoken.token=randomtoken
                        newtoken.action='Verification'
                        newtoken.state='Active'
                        newtoken.account=request.POST.get('email')
                else:

                    return HttpResponse(status=500,content=result.status_code+" Failed to create an account")
            except:
                HttpResponse(status=500,content="Internal Server Error")
            try:
                ActionToken.objects.get(account=request.POST.get('email'))
                ActionToken.objects.filter(account=request.POST.get('email')).delete()
                newtoken.save()
                return HttpResponse(status=200, content="Account Created Successfully")
            except ObjectDoesNotExist:
                try:
                   newtoken.save()
                   return HttpResponse(status=200, content="Account Created Successfully")
                except:
                   return HttpResponse(status=500,content="Internal Server Error")
        except:
            return HttpResponse(status=500,content="Internal Server Error")

    else:
        return HttpResponse(status=403,content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def recovertiper(request):
    if request.method == 'POST':
       try:
         #check if user exists in db first
         try:
            User.objects.get(email=request.POST.get('email'))
            #send email
            randomtoken = get_random_string(length=35)

            # send email
            recover_account_email = {
                'Messages': [
                    {
                        "From": {
                            "Email": "developer.ericke@gmail.com",
                            "Name": "FutaTips"
                        },
                        "To": [
                            {
                                "Email": request.POST.get('email'),
                                "Name": ""
                            }
                        ],
                        "Subject": "Account Action",
                        "HTMLPart": "<div style='text-align:center;font-weight:bolder;text-decoration:underline;font-size:x-large'>"
                                    "Reset Password Instructions</div><br><br>"
                                    "<p>Hi there,<br> We have receieves a request to reset your password for your FutaTips Account."
                                    "<br>To reset your password, <a style='font-weight:bolder' href='https://futatips.herokuapp.com/admins/verified-email/?token=" + randomtoken + "'> click here </a><<br /><br><br>"
                                                                                                                                                                  "If you are having issues while recovering your account ,contact the system admin <br><br>"
                                                                                                                                                                  "<span style='text-decoration:italic'>Eric Nderitu,<br>Futatips Admin</span></p> "
                    }
                ]
            }

            try:
                result = mailjet.send.create(data=recover_account_email)

                if result.status_code == 200:

                    # if email was success add to db token
                   try:
                    ActionToken.objects.filter(account =request.POST.get('email')).update(action='PasswordReset',state='Active',token=randomtoken)
                    return HttpResponse(status=200, content="success")
                   except:
                       return HttpResponse(status=500,content="Internal server error")
                else:

                    return HttpResponse(status=500, content=result.status_code + " Failed to Recover your account.Retry Later")
            except:
                return HttpResponse(status=500,content="Internal Server Error")
         except:
             return HttpResponse(status=403,content="User Not Found")



       except:
         return HttpResponse(status=200,content="success")
    else:
        return HttpResponse(status=403,content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def bantipper(request):
    if request.method == 'POST':
        print(request.POST)
        try:
            User.objects.get(email=request.POST.get('email'))
            User.objects.filter(email=request.POST.get('email')).update(is_active=False)

            return HttpResponse(status=200, content="success")
        except ObjectDoesNotExist:
            return HttpResponse(status=403, content="Account Does Not Exist")
        except:
            return HttpResponse(status=500, content="Internal Server Error")
    else:
        return HttpResponse(status=403,content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def deletetiper(request):
    if request.method == 'POST':
        try:
           User.objects.get(email=request.POST.get('email'))
           User.objects.filter(email=request.POST.get('email')).delete()
           return HttpResponse(status=200, content="success")
        except ObjectDoesNotExist:
           return HttpResponse(status=404, content="Account Does Not Exist")
        except:
           return HttpResponse(status=500, content="Internal Server Error")
    else:
        return HttpResponse(status=403,content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def profile(request):
    try:

        context={'email':request.user.email,'username':request.user}
        return render(request, 'admins/profile.html',context)
    except:
        return render(request, 'admins/NOT-FOUND.html', {'error': 'Internal Server Error'})

@login_required(login_url='/admins/login/')
def profileupdate(request):


    if request.method == 'POST':
        try:
            # update email:
            if request.POST.get('username') == 'Null' and request.POST.get('email') != 'Null':
                # update email
                return HttpResponse(status=400, content="Action Not Allowed")
            elif request.POST.get('email') == 'Null' and request.POST.get('username') != 'Null':
                # update username
                try:
                    User.objects.get(email=request.user.email)
                    User.objects.filter(email=request.user.email).update(
                        username=request.POST.get('username'))
                    return HttpResponse(status=200, content="Okay")
                except ObjectDoesNotExist:
                    return HttpResponse(status=404, content="User Not Found")
                except:

                    return HttpResponse(status=404, content="User Not Found")
            else:

                return HttpResponse(status=400, content="Action Not Allowed")
        except:
            return HttpResponse(status=500, content='Internal Server Error')

    else:
        return HttpResponse(status=403, content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def changeuserpassword(request):
    if request.method == 'POST':
      try:
        user = User.objects.get(username=request.user)
        form = PasswordChangeForm(user=user, data=request.POST)

        if form.is_valid():
            form.save()
            return HttpResponse(status=200, content="Success")

        else:

            return HttpResponse(status=500, content="Old password is Incorrect or New password may contain a weak password  ")

      except ObjectDoesNotExist:
          return HttpResponse(status=404,content="User Does Not Exist")
      except:
          return HttpResponse(status=500,content="Internal Server Error")

    else:
        return HttpResponse(status=403, content="Method Not Allowed")

@login_required(login_url='/admins/login/')
def deleteaccount(request):
    if request.method == 'POST':
      try:
        u = User.objects.get(email=request.user.email)
        if (u.check_password(request.POST.get('password')) == True):
            try:
                u.delete()
                return HttpResponse(status=200, content="Success")
            except:
                return HttpResponse(status=500, content="Internal Server Error")

        else:
            return HttpResponse(status=403, content="The password you provided was invalid.")
      except ObjectDoesNotExist:
          return HttpResponse(status=404,content="User does not exist")
      except:
          return HttpResponse(status=500,content="Internal Server Error")
    else:
        return HttpResponse(status=403, content="Method Not Allowed")

#competitions
@login_required(login_url='/admins/login/')
def competitions(request):
     if request.user.is_staff==True:
        try:
            allcountries = Competitions.objects.all()
            allleagues = Leagues.objects.all()
            context={'countries':allcountries,'leagues':allleagues}
            return render(request, 'admins/competitions.html', context)
        except:
            return HttpResponse(status=500,content="Internal Server Error")
     else:
         return HttpResponse(status=403, content="Error! You do not have the Sufficient Privileges to Manage Competitions. ")


@login_required(login_url='/admins/login/')
def addcountry(request):
    if request.method == 'POST' and request.user.is_staff==True:
           newcountry = Competitions()
           newcountry.country=request.POST.get('country')


           try:
              Competitions.objects.get(country__icontains=request.POST.get('country'))
              #Competitions.objects.get(country=request.POST.get('country'))
              return HttpResponse(status=400,content='Country already Exists')
           except ObjectDoesNotExist:
              newcountry.save()
              return HttpResponse(status=200, content='success')
           except MultipleObjectsReturned:
               return HttpResponse(status=400, content='Country already Exists')
           except:
               return HttpResponse(status=500,content="Internal Server Error")

    else:
        return HttpResponse(status=405,content="Not Allowed")
@login_required(login_url='/admins/login/')
def addleague(request):
    if request.method == 'POST' and request.user.is_staff==True:
        #newleague.league_icon = request.POST.get('league_icon')
        try:
            Competitions.objects.get(country=request.POST.get('country'))
            try:
                Leagues.objects.get(league__icontains=request.POST.get('league'))
                return HttpResponse(status=400, content='League already Exists')
            except ObjectDoesNotExist:
                try:
                    newleague = Leagues(Competitions)
                    country =Competitions.objects.get(country=request.POST.get('country'))
                    newleague.country = country
                    newleague.league = request.POST.get('league')
                    newleague.league_icon= request.POST.get('country')+'_'+request.POST.get('league')+'.jpeg'
                    newleague.save()
                    return HttpResponse(status=200, content='success')
                except ObjectDoesNotExist:
                    # Country and league are valid
                    return HttpResponse(status=400, content='Country Does Not Exists')
            except MultipleObjectsReturned:
                return HttpResponse(status=400, content='League already Exists')
            except Exception as e:
                print(e)
                return HttpResponse(status=500, content="Internal Server Error")

        except ObjectDoesNotExist or MultipleObjectsReturned:
            return HttpResponse(status=404,content="Country Not Recognized")
        except Exception as e:
            print(e)
            return HttpResponse(status=500,content="Internal Server Error")
    else:
        return HttpResponse(status=405, content="Action not allowed or you have insufficient priviledges to perform the action ")

@login_required(login_url='/admins/login/')
def deleteprediction(request):
    if(request.method== 'POST'):
      print(request.POST)
      try:
          Predictions.objects.get(auther=request.user, game_title=request.POST.get('game'),
                                     date=request.POST.get('date'))
          Predictions.objects.filter(auther=request.user,game_title=request.POST.get('game'),date=request.POST.get('date')).delete()
          return HttpResponse(status=200,content="success")
      except ObjectDoesNotExist:
          return HttpResponse(status=404,content="Prediction to delete not found")
      except:
          return HttpResponse(status=500,content="Internal Server Error")
    else:
     return HttpResponse(status=403,content="Method not allowed")
@login_required(login_url='/admins/login/')
def addprediction(request):
    if(request.method=='POST'):
        new_prediction = Predictions()
        #steps
        #check action to be performed
        #if to add new game,check if a similar prediction exists already,if none exists add
        #if to edit existing,check if the prediction to edit is valid,if not rejec edit
        Leagues.objects.get(country=request.POST.get('country'), league=request.POST.get('league'))
        new_prediction.country = request.POST.get('country')
        new_prediction.league = request.POST.get('league')
        new_prediction.match = request.POST.get('match')
        new_prediction.venue = request.POST.get('venue')
        new_prediction.kickoff_date = request.POST.get('date')
        new_prediction.kickoff_time = request.POST.get('time')
        new_prediction.referee = request.POST.get('referee')
        new_prediction.teamone = request.POST.get('teamone')
        new_prediction.teamtwo = request.POST.get('teamtwo')
        new_prediction.match_overview = request.POST.get('matchoverview')
        new_prediction.prediction_one_type = request.POST.get('predonetype')
        new_prediction.prediction_one_value = request.POST.get('tiponevalue')
        new_prediction.prediction_one_odds = request.POST.get('tiponeodds')
        new_prediction.prediction_two_type = request.POST.get('tiptwotype')
        new_prediction.prediction_two_value = request.POST.get('tiptwovalue')
        new_prediction.prediction_two_odds = request.POST.get('tiptwoodds')
        new_prediction.prediction_three_type = request.POST.get('tipthreetype')
        new_prediction.prediction_three_value = request.POST.get('tipthreevalue')
        new_prediction.prediction_three_odds = request.POST.get('tipthreeodds')
        new_prediction.team_one_mp = request.POST.get('teamonemissingplayers')
        new_prediction.team_two_mp = request.POST.get('teamtwomissingplayers')
        new_prediction.team_one_fm_gm1 = request.POST.get('teamonefmg1')
        new_prediction.team_one_fm_gm2 = request.POST.get('teamonefmg2')
        new_prediction.team_one_fm_gm3 = request.POST.get('teamonefmg3')
        new_prediction.team_one_fm_gm4 = request.POST.get('teamonefmg4')
        new_prediction.team_one_fm_gm5 = request.POST.get('teamonefmg5')
        new_prediction.team_two_fm_gm1 = request.POST.get('teamtwofmg1')
        new_prediction.team_two_fm_gm2 = request.POST.get('teamtwofmg2')
        new_prediction.team_two_fm_gm3 = request.POST.get('teamtwofmg3')
        new_prediction.team_two_fm_gm4 = request.POST.get('teamtwofmg4')
        new_prediction.team_two_fm_gm5 = request.POST.get('teamtwofmg5')
        new_prediction.game_title = request.POST.get('gameslug')
        logged_user = User.objects.get(username=request.user)
        new_prediction.auther = logged_user

        try:
           #check action type
           if(request.POST.get('actiontype') == 'edit'):
                 try:
                     Predictions.objects.filter(game_title__icontains=request.POST.get('gameslug'),
                                                date__icontains=request.POST.get('write_date')).delete()
                     new_prediction.save()
                     return HttpResponse(status=200, content=request.POST.get('gameslug'))
                 except ObjectDoesNotExist:
                     return HttpResponse(status=404,content="The match  you are trying to edit no longer Exists")
                 except:
                     return HttpResponse(status=500,content="Internal Server Error")


           elif (request.POST.get('actiontype') == 'add'):
                try:
                    Predictions.objects.get(teamone__icontains=request.POST.get('teamone'),
                                            kickoff_date__icontains = request.POST.get('date'))
                    slg = Predictions.objects.get(teamone__icontains=request.POST.get('teamone'),
                                            kickoff_date__icontains = request.POST.get('date'))
                    return HttpResponse(status=400,
                                        content="Match already Exists <a href='/admins/view-tip/" + slg.game_title + '/' + request.POST.get(
                                            'date') + "'>Click here to edit The Tip Instead</a>")

                except MultipleObjectsReturned:
                    return HttpResponse(status=400,
                                        content="Match already Exists <a href='/admins/view-tip/" + request.POST.get(
                                            'gameslug') + '/' + request.POST.get(
                                            'date') + "'>Click here to edit The Tip Instead</a>")
                except ObjectDoesNotExist:

                    try:
                        Leagues.objects.get(country=request.POST.get('country'), league=request.POST.get('league'))
                        new_prediction.save()
                        return HttpResponse(status=200, content=request.POST.get('gameslug'))
                    except:
                        return HttpResponse(status=404,content="Country or League not Found in our Records")

                except:
                    return HttpResponse(status=500,content="Internal Server Error")
           else:
               return HttpResponse(status=403,content="Action not Allowed")
        except Exception as e:

            return HttpResponse(status=500,content="Internal Server Error")

    else:
        return HttpResponse(status=403,content="Method Not Allowed")


def addUser(request):
    if(request.method == 'GET'):

       if(request.GET.get('token')=='None'):
          return HttpResponse(status=400,content="Error 400! We could not find a verification token in your url.Check your email inbox"
                                                 " and ensure you have clicked on the correct link.If the issue persists,contact the system admin")

       else:
           try:
             mytoken = ActionToken.objects.get(token=request.GET.get('token'))
             if(mytoken.action=='Verification'):
              return render(request, 'admins/verified-email.html',
              {'password_reset': 'None', 'get_started': 'Block', 'token_state': 'accepted','token':mytoken.token})
             else:
                 return render(request, 'admins/verified-email.html',
                               {'password_reset': 'Block', 'get_started': 'None', 'token_state': 'accepted',
                                'token': mytoken.token})
           except ObjectDoesNotExist or MultipleObjectsReturned:
               return HttpResponse(status=400,content="Error 400! The  verification link appears to be broken and invalid .Check your email inbox"
                                                 " and ensure you have clicked on the correct link.If the issue persists,contact the system admin")
           except:
               HttpResponse(status=500,content="Error 500! Internal Server Error")


           return HttpResponse(status=200,content="Success")

    else:
        return HttpResponse(status=403,content="Method not allowed")



def checkusername(request):
    #print(request.headers.get('Verification-Token'))
    ##check the verification token from the verification model first

    try:
        User.objects.get(username=request.POST.get('username'))
        return HttpResponse(status=400, content="username taken")
    except ObjectDoesNotExist:
        return HttpResponse(status=200,content="username available")
    except:
        return HttpResponse(status=500,content="Internal Server Error")


def passwordupdate(request):
    if(request.method=='POST'):
       print(request.headers.get('Verification-Token'))
       try:
          x= ActionToken.objects.get(token=request.headers.get('Verification-Token'), state='Active')
          #token is okay
          u = User.objects.get(email=x)
          u.set_password(request.POST.get('password'))
          u.save()
          ActionToken.objects.filter(token=request.headers.get('Verification-Token'), state='Active').update(state='Expired')
          #Send a Security Email to update user maybe
          return HttpResponse(status=200, content='Password Updated Successfully')
       except ObjectDoesNotExist:

           return HttpResponse(status=403,content="Bad or Expired Verification Token.Re-check your Email and Click on the correct link sent to you")
       except:
           return HttpResponse(status=403,content="Broken or Expired")
    else:
       return HttpResponse(status=403,content="Method Not Allowed")




def dummy(request):
    form = AuthenticationForm()

    return render(request,'admins/dummy.html',{'form':form})