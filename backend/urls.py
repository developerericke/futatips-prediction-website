from django.urls import path
from . import views

urlpatterns =[
    path('dashboard/',views.dashboard),
    path('profile/',views.profile),
    path('reset-password/',views.resetpassword),
    path('verify-email/',views.verifiedemail),
    path('users/',views.manageusers),
    path('add-prediction/',views.addtip),
    path('manage-tip/',views.manageprediction),
    path('view-tip/<slug:match>/<str:kickoff>',views.viewprediction),
    #competitins page
    path('competitions/',views.competitions),
    path('addcountry/',views.addcountry),
    path('addleague/',views.addleague),
    #add prediction
    path('addprediction/',views.addprediction),
    path('deleteprediction/',views.deleteprediction),
    path("verified-email/",views.addUser),
    path('checkusername/',views.checkusername),
    path('get-started/',views.registerUser),
    path('update-password/',views.passwordupdate),
    path('profile-update/',views.profileupdate),
    path('change-password/',views.changeuserpassword),
    path('delete-account/',views.deleteaccount),
    path('login/',views.login_user),
    path('logout/',views.logout_user),
    path('addtiper/',views.addtiper),
    path('recover-tipper/',views.recovertiper),
    path('ban-tipper/',views.bantipper),
    path('delete-tipper/',views.deletetiper),
    path('dummy/',views.dummy)

]
