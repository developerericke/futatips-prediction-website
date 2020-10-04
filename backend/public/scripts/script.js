document.addEventListener('DOMContentLoaded',function(){

    //get current page
    let currenturl = window.location.href
    
    let xhr = new XMLHttpRequest()
    function has_invalid_characters(value){
      let scriptpattern = /[<!?>=]/
      let searchscriptword = /script*/

      let newvalue = value.toString()
       if(scriptpattern.test(newvalue)===false && searchscriptword.test(newvalue)===false){
              return false;
       }else{
              return true;
       }
    }
    function has_valid_inputs(input){
        let checkcharacters = /[A-Za-z]/
        let checknumbers = /[0-9]/

        somevalue = input.toString()
        if(checkcharacters.test(somevalue)===true || checknumbers.test(somevalue)===true && somevalue.length>0){
          return true;
        }else{
            return false
        }
    }

    function grabById(tograb){
        let id = '#'+tograb
        
        return document.querySelector(id)
    } 

if(currenturl.search('login')>-1){
                //authentication 
                let authenticateForm = document.querySelector("#authenticateForm")
                let tologuser = document.querySelector('#username')
                let tologpassword = document.querySelector('#password')
                let usernamelabel = document.querySelector('#label-username')
                let passwordlabel = document.querySelector('#label-password')

                //check user input as they key
                tologuser.addEventListener('keyup',function(e){
                    if(has_invalid_characters(this.value)===true){
                        usernamelabel.innerHTML = '<span style="font-size:smaller" class="text-danger font-weight-bold">Username cannot be empty or contain invalid characters</span> '
                        this.value= (this.value).replace(this.value[this.value.length-1],'')            
                    }else{
                        usernamelabel.innerHTML ='Username'
                    }
                })
                //check user input as they key
                tologpassword.addEventListener('keyup',function(e){
                    if(has_invalid_characters(this.value)===true){
                        passwordlabel.innerHTML = '<span style="font-size:smaller" class="text-danger font-weight-bold">Password cannot be empty or contain invalid characters</span> '
                        this.value= (this.value).replace(this.value[this.value.length-1],'')            
                    }else{
                        passwordlabel.innerHTML ='Password'
                    }
                })
                //show or hide password
                let passwordswitch = document.querySelector('#passworddisplay')
                passwordswitch.addEventListener('click',function(){
                    
                    if(tologpassword.type==='password'){
                        this.innerHTML ='Hide'
                        tologpassword.type ='text'
                    }else if(tologpassword.type==='text'){
                        tologpassword.type='password'
                        this.innerHTML ='Show'
                    }

                
                })
                        //process login form
                        authenticateForm.addEventListener('submit',function(e){
                            
                            document.querySelector('#server-response').style.display ='none'
                            document.querySelector('#server-response').innerHTML=""
                            e.preventDefault()
                            let login_button = document.querySelector('#login-button')

                            
                            let serverresp = document.querySelector('#server-response')
                            let requeststatus = document.querySelector('#loader')
                            if(has_invalid_characters(tologuser.value)===false && has_valid_inputs(tologuser.value)===true){
                                //check password
                                
                                if(has_invalid_characters(tologpassword.value)===false && has_valid_inputs(tologpassword.value)===true){
                                    requeststatus.style.display ="block"
                                    login_button.disabled = true
                                    xhr.onreadystatechange = function(){
                                        
                                        
                                        if(this.readyState===4){
                                            login_button.disabled = false
                                            requeststatus.style.display ="none"
                                            
                                            if(this.status===0){
                                                serverresp.style.display ='block'
                                                serverresp.innerHTML="Error. You connection to the internet could not be established."
                                            
                                            }else if(this.status===200){
                                                requeststatus.style.display='block'
                                                requeststatus.innerHTML ="Login success"
                                                if(grabById('nextroute').value!=='None'){
                                                    window.location.href =grabById('nextroute').value
                                                }else{
                                                    window.location.href ='/admins/dashboard'
                                                }
                                                
                                            }else{
                                                

                                                serverresp.style.display ='block'
                                                serverresp.innerHTML="Error! " +  xhr.responseText
                                            }
                                        }

                                    }
                                    xhr.open('POST','/admins/login/')
                                    xhr.setRequestHeader('content-type','application/x-www-form-urlencoded')
                                    xhr.setRequestHeader('X-CSRFToken',document.querySelector('[name=csrfmiddlewaretoken]').value)
                                    xhr.send('username='+tologuser.value+'&next='+grabById('nextroute').value+'&password='+tologpassword.value+'&csrfmiddlewaretoken='+document.querySelector('[name=csrfmiddlewaretoken]').value)
                                }else{
                                    passwordlabel.innerHTML = '<span style="font-size:smaller" class="text-danger font-weight-bold">Password cannot be empty or contain invalid characters</span> '

                                }

                            }else{
                                usernamelabel.innerHTML = '<span style="font-size:smaller" class="text-danger font-weight-bold">Username cannot be empty or contain invalid characters</span> '


                            }
                            


                })
}else if( currenturl.search('add-prediction')>-1){
   
    let extractedCookie 
                //check if a valid cookie exist
                if(document.cookie.search('editprediction')>-1){
                  let cookieItems= document.cookie.split(';')
                  function checkindex(){
                     
                    for(var i=0;i<cookieItems.length;i++){
                        if(cookieItems[i].search('editprediction')>-1){
                            return i
                        }
                    }
                     
                   
                  }
               
                
                  
                 extractedCookie= document.cookie.split(';')[checkindex()]
                }
                

                //grab all input fields
                      
               
                let selectopts = document.querySelectorAll('select')
                selectopts.forEach((options)=>{
                    options.addEventListener('keyup',function(e){
                        if(has_invalid_characters(this.value)===true){
                        this.value= (this.value).replace(this.value[this.value.length-1],'')            
                        }
                    })
                })
                let textareas = document.querySelectorAll('textarea')
                textareas.forEach((area)=>{
                    area.addEventListener('keyup',function(e){
                        if(has_invalid_characters(this.value)===true){
                        this.value= (this.value).replace(this.value[this.value.length-1],'')            
                        }
                    })
                })
                let inputs = document.querySelectorAll('input')
                
                inputs.forEach((input)=>{
                    input.addEventListener('keyup',function(e){
                        if(has_invalid_characters(this.value)===true){
                        this.value= (this.value).replace(this.value[this.value.length-1],'')            
                        }
                    })
                })
                let match = grabById('game-title');let kickoff = grabById('kickoffdate');let kickofftime = grabById('kickofftime');let country = grabById('country')
                let league = grabById('league');let match_img_option = document.querySelectorAll('[name=matchimg-opt]');let match_image = grabById('match_img_file')
                let tip_one_type = grabById('pred_one_type');let tip_one_value = grabById('pred-one');let tip_one_odds = grabById('pred_one_odds')
                let tip_two_type = grabById('pred_two_type');let tip_two_value  =grabById('pred-two');let tip_two_odds = grabById('pred-two-odds')
                let tip_three_type = grabById('pred_three_type');let tip_three_value  =grabById('pred-three');let tip_three_odds = grabById('pred-three-odds'); 
                let venue = grabById('game-venue');let referee = grabById('referee'); let gamedescribe = grabById('match-description')
                let team_one_form_gm1 = grabById('match5');let team_one_form_gm2 = grabById('match4');let team_one_form_gm3 = grabById('match3');let team_one_form_gm4 = grabById('match2');let team_one_form_gm5 = grabById('match1')
                let team_two_form_gm1 = grabById('match5-2');let team_two_form_gm2 = grabById('match4-2');let team_two_form_gm3 = grabById('match3-2');let team_two_form_gm4 = grabById('match2-2');let team_two_form_gm5 = grabById('match1-2')
                let team_one_mp = grabById('team-one-mp');let team_two_mp = grabById('team-two-mp')
                let message_success = grabById('successmsg');let message_failure=grabById('failuremsg');let form = grabById('add-pred-form')
                let image_preview = grabById('img-preview')

                match.addEventListener('keyup',function(e){
                      let regex = /[A-Za-z]/ 
                      if(regex.test(this.value[0]) === false){
                          this.value = ''
                      }
                })
                
                grabById('country').addEventListener('change',function(e){
                   grabById('league').querySelectorAll('option').forEach((opt)=>{
                       if(opt!=='default'){
                          opt.style.display='none'
                       }
                   })
                    document.querySelectorAll('.'+this.value).forEach((option)=>{
                          
                         if(option.classList.value===this.value){
                             option.style.display='Block'
                         }else{
                             option.style.display='None'
                         }
                        
                       
                        
                    })
                })
                
                
              //append data if user is editing a prediction
                
               if(window.location.href.split('?')[1]!==undefined){
                   let querypart =window.location.href.split('?')[1]

                  
                   if(querypart.search('action=edit')>-1 && querypart.search('id')>-1){
                    
                    let actionType = grabById('someactiontype')
                   
                    actionType.value='edit'
                     //valid action found
                     let data_to_add =  extractedCookie.replace('editprediction=','').split('&')
                     
                     grabById('editmode').style.display='inline'
                     match.value=data_to_add[1].split('=')[1]
                     tip_one_type.value = data_to_add[16].split('=')[1]
                     tip_one_value.value = data_to_add[17].split('=')[1]
                     tip_one_odds.value = data_to_add[18].split('=')[1]
                     tip_two_type.value =data_to_add[19].split('=')[1]
                     tip_two_value.value =data_to_add[20].split('=')[1]
                     tip_two_odds.value =data_to_add[21].split('=')[1]
                     tip_three_type.value =data_to_add[22].split('=')[1]
                     tip_three_value.value =data_to_add[23].split('=')[1]
                     tip_three_odds.value =data_to_add[24].split('=')[1]
                     team_one_mp.value=data_to_add[25].split('=')[1]
                     team_two_mp.value=data_to_add[26].split('=')[1]
                     team_one_form_gm1.value=data_to_add[6].split('=')[1]
                     team_one_form_gm2.value=data_to_add[7].split('=')[1]
                     team_one_form_gm3.value=data_to_add[8].split('=')[1]
                     team_one_form_gm4.value=data_to_add[9].split('=')[1]
                     team_one_form_gm5.value=data_to_add[10].split('=')[1]
                     team_two_form_gm1.value=data_to_add[11].split('=')[1]
                     team_two_form_gm2.value=data_to_add[12].split('=')[1]
                     team_two_form_gm3.value=data_to_add[13].split('=')[1]
                     team_two_form_gm4.value=data_to_add[14].split('=')[1]
                     team_two_form_gm5.value=data_to_add[15].split('=')[1]
                     country.value=data_to_add[27].split('=')[1]
                     league.value =data_to_add[28].split('=')[1]
                     tip_one_type.value =data_to_add[30].split('=')[1]
                     tip_two_type.value =data_to_add[31].split('=')[1]
                     tip_three_type.value =data_to_add[32].split('=')[1]
                     venue.value =data_to_add[2].split('=')[1]
                     referee.value =data_to_add[3].split('=')[1]
                     grabById('write_date').value= data_to_add[29].split('=')[1]
                     grabById('game-slug').value =value=data_to_add[0].split('=')[1]
                    document.querySelector('body').scrollTop=0
                    match.disabled=true
                    country.disabled = true
                    league.disabled = true
                    
                    message_success.style.display='block'
                    message_success.innerHTML="<small>Note: Fields for <span class='font-weight-bold'>"+data_to_add[1].split('=')[1]+"</span> have been populated.<mark>Match Kickoff time,Date,Prediction one odds and Description/Overview</mark> have been reset </small>" 
                    grabById('prediction-identify').setAttribute('data-predID',data_to_add[0].split('=')[1]) 
                   }
                 
               }

               
               
               // let check_user_action = window.length.href.split('?')[1]

                match_image.addEventListener("input",function(){
                    document.querySelector('#img-select-label').innerHTML = match_image.files[0].name
                })
                form.addEventListener('submit',function(e){
                   //check if fields are empty
                
                    
                
                    message_failure.innerHTML=''
                    message_failure.style.display='none'
                    message_success.innerHTML=''
                    message_success.style.display='none'
                
                e.preventDefault()
                let errors =[]
                //check match      
                if(has_valid_inputs(match.value)===false || has_invalid_characters(match.value)===true){           
                    errors.push('Enter a Valid Match')
                }
                if(has_valid_inputs(league.value)===false || has_invalid_characters(league.value)===true){
                            errors.push('Enter a Valid League')  
                }  
                if(has_invalid_characters(kickofftime.value)===true || kickofftime.value.length<1){
                            errors.push('Enter a Valid Kickoff Time')
                } 
                
                if(has_invalid_characters(kickoff.value)===true || kickoff.value.length<1){
                
                errors.push('Enter a Valid Kickoff Date')
                }
                if(has_invalid_characters(country.value)===true|| has_valid_inputs(country.value)===false){
                
                            errors.push('Enter a Valid Country')
                }  
                if(has_valid_inputs(tip_one_type.value)===false || has_invalid_characters(tip_one_type.value)===true 
                || has_valid_inputs(tip_one_value.value)===false || has_invalid_characters(tip_one_value.value)===true){
                                errors.push('Enter a valid prediction one Value')
                }if(tip_one_odds.value === '' || tip_one_odds.value<1){
                    errors.push('Enter valid prediction one Odds')
                }

            
                let date= new Date()
                let today= date.getTime()-86400000

                
                let kickoff_date = new Date(kickoff.value)
            
                if(kickoff_date.getTime()<today){
                    errors.push('Kickoff Date cannot be in the past')
                }else if(kickoff_date.getTime()===today || kickoff_date.getTime()>today){
                
                }

                
                document.querySelector('body').scrollTop=0
                if(errors.length===0){
                    let tipid
                    if( grabById('prediction-identify').getAttribute('data-predID')!==null){
                      tipid= grabById('prediction-identify').getAttribute('data-predID')
                    }else{
                        tipid='N/A'
                    }
                    let gameslug =grabById('game-slug')
                    let create_slug =''
                    match.value = match.value.replace('.',' ')
                    
                    let allchars =match.value.split(' ')
                    
                     for (var i=0;i<allchars.length;i++){

                      if(i>0){
                        create_slug= create_slug + '-' +allchars[i]
                      }else{
                        create_slug= create_slug + allchars[i]
                      }  
                      
                    }
                   
                    
                    if(gameslug.value===''){
                        gameslug.value = create_slug
                    }   
                    document.querySelectorAll('input').forEach((input)=>{
                   
                        if(input.type !=='file' && input.type !=='number'){
                            if(input.value === '' || input.value<3){
                                input.value="Not-Provided"
                        }
    
    
                        }
                    })
                    document.querySelectorAll('textarea').forEach((input)=>{
                        if(input.value === '' || input.value<3){
                                input.value="Not-Provided"
                        }
    
                    })
                    document.querySelectorAll('select').forEach((input)=>{
                        if(input.value === " " || input.value<2){
                                input.value="Not-Provided"
                        }
    
                    })
                    
                    let to_send_data='country='+country.value+'&league='+league.value+'&match='+match.value+'&date='+kickoff.value+
                    "&time="+kickofftime.value+'&referee='+referee.value+"&matchoverview="+gamedescribe.value+"&venue="+venue.value+"&predonetype="+tip_one_type.value
                    +"&tiponevalue="+tip_one_value.value+"&tiponeodds="+grabById('pred_one_odds').value+"&tiptwotype="+tip_two_type.value
                    +"&tiptwovalue="+tip_two_value.value+"&tiptwoodds="+grabById('pred-two-odds').value+"&tipthreetype="+tip_three_type.value
                    +"&tipthreevalue="+tip_three_value.value+"&tipthreeodds="+grabById('pred-three-odds').value+"&teamonefmg1="+team_one_form_gm1.value
                    +"&teamonefmg2="+team_one_form_gm2.value+"&teamonefmg3="+team_one_form_gm3.value+"&teamonefmg4="+team_one_form_gm4.value
                    +"&teamonefmg5="+team_one_form_gm5.value+"&teamtwofmg1="+team_two_form_gm1.value+"&teamtwofmg2="+team_two_form_gm2.value
                    +"&teamtwofmg3="+team_two_form_gm3.value+"&teamtwofmg4="+team_two_form_gm4.value+"&teamtwofmg5="+team_two_form_gm5.value
                    +"&teamonemissingplayers="+team_one_mp.value+"&teamtwomissingplayers="+team_two_mp.value+'&id='+tipid+'&gameslug='+gameslug.value
                    +'&actiontype='+grabById('someactiontype').value+'&teamone='+match.value.split('vs')[0]+'&teamtwo='+match.value.split('vs')[1]+'&write_date='+grabById('write_date').value
                    console.log(grabById('pred_one_odds').value)
                    
                  
                    message_failure.style.display='none'
                    message_success.style.display='block'
                    message_success.innerHTML='<small><span class="font-weight-bold">Submitting Your Prediction.Please Wait <span class="spinner-border spinner-border-sm"></span></span></small>'
                let fields= document.querySelectorAll('input')
                fields.forEach((field)=>{
                    field.disabled=true
                })
                grabById('add-pred-button').style.display='none'
                    xhr.onreadystatechange= function(){
                        if(this.readyState===4){
                            fields.forEach((field)=>{
                                field.disabled=false
                            })
                            grabById('add-pred-button').style.display='block'
                            if(this.status===0){
                            message_success.style.display='none'
                            message_failure.style.display='block'
                            message_failure.innerHTML ='<small>Connection Could Not be Established.Check Your Internet Connection</small>'
                            }else if(this.status===200){
                                message_failure.style.display='none'
                                message_success.style.display='block'
                                message_success.innerHTML='<h6>Success.<span class="font-weight-bolder p-1"> '+match.value+'</span> Prediction Uploaded Succesfully. <br><small> <a href="/admins/view-tip/'+this.responseText+'/'+kickoff.value+'"> <button style="font-size:tiny" class="btn btn-info m-2 btn-sm">View It here</button> </a></small> <br><small><a href=""><button onclick="window.location.href ="/admins/add-prediction/"" class="btn btn-success m-1 btn-sm">Add another Prediction</button></a> </small>'+   
                                '</h6>'
                                grabById('form-wrapper').style.display ='None'
        
                            }else{
                                message_success.style.display='none'
                                message_failure.style.display='block'
                                message_failure.innerHTML ='<small>Error! '+this.responseText+'</small>'
                            }
                        }
                    }


                   
                  
                    
                    xhr.open('POST','/admins/addprediction/')
                    xhr.setRequestHeader('content-type','application/x-www-form-urlencoded')
                    xhr.setRequestHeader('X-CSRFToken',document.querySelector('[name=csrfmiddlewaretoken]').value)
                    xhr.send(to_send_data)
                }else{
                    message_success.style.display='none'
                    message_failure.style.display='block'
                    let htmlerrors ='<div style="text-decoration:underline" class="font-weight-bold">Correct The Errors Below</div>'
                    errors.forEach((error)=>{
                        htmlerrors=htmlerrors+'<small><div>'+error+'</div></small>'
                    })
                    message_failure.innerHTML=htmlerrors
                }
                
         


        })



}else if(currenturl.search('view-tip')>-1){

  //fecch the Value
  let gameID,match,venue,referee,kickofftime,kickoffdate,team1fmg1,team1fmg2,team1fmg3,team1fmg4,team1fmg5,
  team2fmg1,team2fmg2,team2fmg3,team2fmg4,team2fmg5,team1mp,team2mp,desc,pred1type,pred1value,pred1odds,
  pred2type,pred2value,pred2odds,pred3type,pred3value,pred3odds,writtendate

  gameID = grabById('prediction-id').innerHTML,match=grabById('match').innerHTML,
  venue=grabById('venue').innerHTML,referee=grabById('referee').innerHTML
  kickofftime=grabById('kickofftime').innerHTML,kickoffdate=grabById('kickoffdate').innerHTML
  team1fmg1=grabById('teamonefmg1').getAttribute('data-result'),team1fmg2=grabById('teamonefmg2').getAttribute('data-result'),
  team1fmg3=grabById('teamonefmg3').getAttribute('data-result'),team1fmg4=grabById('teamonefmg4').getAttribute('data-result')
  team1fmg5=grabById('teamonefmg5').getAttribute('data-result')
  team2fmg1=grabById('teamtwofmg1').getAttribute('data-result'),team2fmg2=grabById('teamtwofmg2').getAttribute('data-result'),
  team2fmg3=grabById('teamtwofmg3').getAttribute('data-result'),team2fmg4=grabById('teamtwofmg4').getAttribute('data-result'),
  team2fmg5=grabById('teamtwofmg5').getAttribute('data-result')
  team1mp=grabById('team1mp').innerHTML,team2mp=grabById('team2mp').innerHTML,desc=grabById('matchdesc').innerHTML
  pred1type=grabById('tip1type').innerHTML,pred1value=grabById('tip1value').innerHTML,pred1odds=grabById('tip1odds').innerHTML
  pred2type=grabById('tip2type').innerHTML,pred2value=grabById('tip2value').innerHTML,pred2odds=grabById('tip2odds').innerHTML
  pred3type=grabById('tip3type').innerHTML,pred3value=grabById('tip3value').innerHTML,pred3odds=grabById('tip3odds').innerHTML
  writtendate=grabById('written_on').getAttribute('data-written'),tiponetype = grabById('tip1type').innerHTML,tiptwotype= grabById('tip2type').innerHTML,tipthreetype= grabById('tip1type').innerHTML

  let data_to_append='gameid='+gameID+'&macth='+match+'&venue='+venue+'&referee='+referee+'&date='+kickoffdate+
  '&time='+kickofftime+'&team1fmg1='+team1fmg1+'&team1fmg2='+team1fmg2+'&team1fmg3='+team1fmg3+'&team1fmg4='+team1fmg4+'&team1fmg5='+team1fmg5+
  '&team2fmg1='+team2fmg1+'&team2fmg2='+team2fmg2+'&team2fmg3='+team2fmg3+'&team2fmg4='+team2fmg4+'&team2fmg5='+team2fmg5+'&pred1type='+pred1type.replace(' ','')+
  '&pred1value='+pred1value+'&pred1odds='+pred1odds.slice(1,)+'&pred2type='+pred2type+'&pred2value='+pred2value+'&pred2odds='+pred3odds.slice(1,)+
  '&pred3type='+pred3type+'&pred3value='+pred3value+'&pred3odds='+pred3odds.slice(1,)+'&team1mp='+team1mp+'&team2mp='+team2mp+'&country='+grabById('pred-details').getAttribute('data-country')+'&league='
  +grabById('pred-details').getAttribute('data-league')+'&written_on='+writtendate+"&tiponetype="+tiponetype+'&tiptwotype='+tiptwotype+'&tipthreetypr='+ tipthreetype

 //define cookie to store

 document.cookie='editprediction='+data_to_append+';path=/'


  let editbutton = grabById('editbutton')
  let deletebutton = grabById('deletebutton')

  editbutton.addEventListener('click',function(){
      window.location.href ='/admins/add-prediction/?action=edit&id='+this.getAttribute('data-game')
  })
  deletebutton.addEventListener('click',function(){
      this.disabled=true
    this.innerHTML='<small>Deleting</small><span class="spinner-border spinner-border-sm"></span>'
     fetch('/admins/deleteprediction/',{
         method:'POST',
        headers: {'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:'game='+this.getAttribute('data-game')+'&date='+this.getAttribute('data-game-date')
     }).then(data=>{
        this.disabled=false
        if(data.status===200){
            document.cookie='editprediction=;expires=Thu, 01 Jan 1970 00:00:00 UTC; "'
            this.innerHTML='Success'
            window.location.href='/admins/dashboard'
        }else{
            this.innerHTML='Failed'
            setTimeout(()=>{
                this.innerHTML='Delete'
            },5000)
        }
       
       
       
      
     }).catch(error=>{
         this.innerHTML='Failed'
         setTimeout(()=>{
             this.innerHTML='Delete'
         },5000)
         
     })
  })
  


}else if(currenturl.search('verified-email')>-1){
    let username = grabById('username')
    let usernamelabel = grabById('usernamelabel')
    let password = grabById('password')
    let confirmpassword = grabById('confirmpassword')
    let passwordToggler = document.querySelectorAll('.passwordtoggle')
    let proceedbtn = grabById('proceedbtn')
    passwordToggler.forEach((toggler)=>{
        toggler.addEventListener('click',function(){
                  
            let field =this.getAttribute('data-to-toggle')
           
            if(grabById(field).type==='text'){
                grabById(field).type='password'
                this.innerHTML='Show'
            }else{
                grabById(field).type='text'
                this.innerHTML='Hide'
            }
           
        })
    })
    username.addEventListener('keyup',function(){
        if(has_invalid_characters(this.value)===true){
            usernamelabel.classList.add('text-danger')
            usernamelabel.innerHTML="Invalid characters identified"
            this.value=this.value.replace(this.value[this.value.length-1],'')
        }else{
            usernamelabel.classList.remove('text-danger')
            usernamelabel.classList.add('text-success')
            usernamelabel.innerHTML='<small>Checking <span class="font-weight-bolder"> '+this.value+'</span> <span class="spinner-grow spinner-grow-sm"></span></small>'
           fetch('/admins/checkusername/',{
               method:'POST',
               headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
               body:'username='+this.value
           }).then((response)=>{
               
              if(response.status===200){
                usernamelabel.classList.remove('text-danger')
                usernamelabel.classList.add('text-success')
                usernamelabel.innerHTML='<small>'+username.value+' is available</small>'
                proceedbtn.disabled=false
              }else{
                usernamelabel.classList.remove('text-success')
                usernamelabel.classList.add('text-danger')
                response.text().then((error)=>{
                   
                    usernamelabel.innerHTML='<small>Error! '+error+'</small>'
                })
                
                proceedbtn.disabled=true
              }
           }).catch((error)=>{
               
               usernamelabel.classList.remove('text-success')
               usernamelabel.classList.add('text-danger')
               usernamelabel.innerHTML='<small>Failed . '+error+'</small>'
           })


        }
      
    })
    password.addEventListener('keyup',function(){
        if(has_invalid_characters(this.value)===true){
           
           this.value=this.value.replace(this.value[this.value.length-1],'')
        }
    })
    confirmpassword.addEventListener('keyup',function(){
        if(has_invalid_characters(this.value)===true){
          
           this.value=this.value.replace(this.value[this.value.length-1],'')
        }
    })

    
   
    let reguser=grabById('registeruser')
    reguser.addEventListener('submit',function(e){
        
        
        let errors=[]
        grabById('errors').innerHTML=''
        grabById('errors').style.display='none'
    
        e.preventDefault()
        document.querySelector('body').scrollTop=0
        let checkNums =/[0-9]/
        let checkAlpha =/[A-Za-z]/
        if(username.value.length<3){
           errors.push('Username must contain atleast 3 Characters')
        }else if(checkNums.test(password.value)===false || checkAlpha.test(password.value)===false || password.value.length<6){
           errors.push("Password must be atleast 6 Characters Long and Contain Numbers and Letters")
        }else if(password.value!==confirmpassword.value){
            errors.push("Confirmation Password did not match desired password")
        }

            if(errors.length===0){
                let formstatus = grabById('formstatus')
                let to_send_data = 'username='+username.value+'&password='+password.value
                formstatus.style.display='block'
                usernamelabel.innerHTML="Choose your Desired Username"
                formstatus.classList.remove('alert-danger')
                formstatus.classList.add('alert-success')
                formstatus.innerHTML=' <h6 >Hey there <span class="font-weight-bold p-1">@'+username.value+'</span>.We are setting up your account.Hold on just for a sec <span class="spinner-grow spinner-grow-sm"></span> </h6>'
                proceedbtn.disabled=true
                let formdatat = $('#registeruser').serialize()
            
                fetch('/admins/get-started/',{
                    method:'POST',
                    headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Verification-Token':document.querySelector('#verifytok').getAttribute('data-verifytoken')},
                    body:formdatat
                }).then((response)=>{
                    
                    if(response.status===200){
                        formstatus.classList.remove('alert-danger')
                        formstatus.classList.add('alert-success')
                        formstatus.innerHTML='<small>Success .Lets finalize.Everything on us now...<span class="spinner-border spinner-border-sm"></span></small>'
                    }else{
                        proceedbtn.disabled=false
                        formstatus.classList.remove('alert-success')
                        formstatus.classList.add('alert-danger')
                        
                        response.text().then((error)=>{
                            
                           // console.log(myerror.querySelectorAll('.errorlist'))
                            
                            formstatus.innerHTML='<small>Error! '+error+'</small>'
                        })
                        
                    }
    
                }).catch((error)=>{
                  formstatus.classList.remove('alert-success')
                  formstatus.classList.add('alert-danger')
                  print(error)
                  formstatus.innerHTML='<small>Failed .'+error+'</small>'
                })
            }else{
                let err= grabById('errors')
                let htmlerrors ='<span class="font-weight-bold" style="text-decoration:underline">Correct the Errors Below</span><br>'
                
                errors.forEach((error)=>{
                    htmlerrors=htmlerrors+'<small>'+error+'</small><br>'
                })
                err.style.display='block'
                err.innerHTML=htmlerrors

            }
            

        
        
    })

    //rest password
    let formtoreset = grabById('reset-password-form')
    let alertstatus = grabById('resetstatus');
    let inputs_reset = formtoreset.querySelectorAll('input')
    inputs_reset.forEach((input)=>{
      input.addEventListener('keyup',function(){
        if(has_invalid_characters(this.value)===true){
            this.value= this.value.replace(this.value[this.value.length-1],'')
        }
    })
    })
    formtoreset.addEventListener('submit',(e)=>{
        
        e.preventDefault()
        let checkums = /[0-9]/
        let checklett =/[a-zA-Z]/
        if(has_valid_inputs(inputs_reset[0].value)===true && inputs_reset[0].value.length>5 && checkums.test(inputs_reset[0].value)===true && checklett.test(inputs_reset[0].value)===true ){
          if(inputs_reset[0].value===inputs_reset[1].value){
            alertstatus.style.display='block'
            alertstatus.classList.remove('alert-danger');alertstatus.classList.add('alert-success')
            alertstatus.innerHTML='<small>Processing request.Please wait <span class="spinner-border spinner-border-sm"></span></small>'
      
            fetch('/admins/update-password/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value,'Verification-Token':document.querySelector('#verifytok').getAttribute('data-verifytoken')},
                body:'password='+inputs_reset[0].value
            }).then((response)=>{
                if(response.status===200){
                    inputs_reset[0].value=''
                    inputs_reset[1].value=''
                    alertstatus.style.display='block'
                    alertstatus.classList.remove('alert-danger');alertstatus.classList.add('alert-success')
                    alertstatus.innerHTML='<small>Success. Password apdated Succesfully.Use your new password on your next login</small>'
                   
                }else{
                    alertstatus.style.display='block'
                    alertstatus.classList.remove('alert-success');alertstatus.classList.add('alert-danger')
                    response.text().then((error)=>{
                        alertstatus.innerHTML='<span style="text-decoration:underline;font-weight:bold">Error! <br></span><small>'+error+'</small>'
                    })
                 
                }

            }).catch((error)=>{
                alertstatus.style.display='block'
                alertstatus.classList.remove('alert-success');alertstatus.classList.add('alert-danger')
                alertstatus.innerHTML='<span style="text-decoration:underline;font-weight:bold">Correct the Errors Below<br></span><small>'+error+'</small>'
          
            })
             
          }else{
            alertstatus.style.display='block'
            alertstatus.classList.remove('alert-success');alertstatus.classList.add('alert-danger')
            alertstatus.innerHTML='<span style="text-decoration:underline;font-weight:bold">Correct the Errors Below<br></span><small>Password Confirmation must match desired password</small>'
      
          }
        }else{
            alertstatus.style.display='block'
            alertstatus.classList.remove('alert-success');alertstatus.classList.add('alert-danger')
            alertstatus.innerHTML='<span style="text-decoration:underline;font-weight:bold">Correct the Errors Below<br></span><small>Password too short and Weak.Include numbers and letter and ensure the password is atleast 6 digits long</small>'
        }
        
    })
}else if(currenturl.search('users')>-1){
    //add mew user
    let action_status = grabById('action-status')
    let addwriterbtn = grabById('addwriter')
    let email = grabById('email')

    grabById('add-writer-form').addEventListener('submit',function(e){
        e.preventDefault()
        if(has_invalid_characters(email.value)===false && has_valid_inputs(email.value)===true){
            action_status.style.display='block'
            action_status.classList.remove('alert-danger')
            action_status.classList.add('alert-success')
            action_status.innerHTML="<small>Working <span class='spinner-border spinner-border-sm'></span></small>"
            
            fetch('/admins/addtiper/',{
              method:'POST',
              headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
              body:'email='+email.value

            }).then((response)=>{
             if(response.status===200){
                action_status.style.display='block'
                action_status.classList.remove('alert-danger')
                action_status.classList.add('alert-success')
                action_status.innerHTML="Success ! <span class='font-weight-bolder'>"+ email.value+' </span>has been added as a writer.An email has been sent to them with futher instructions'
                email.value=''
             }else{
                action_status.style.display='block'
                action_status.classList.remove('alert-success')
                action_status.classList.add('alert-danger')
                response.text().then((error)=>{
                    action_status.innerHTML='<small>Error! '+error+'</small>';
                })
                
             }
            }).catch((error)=>{

                 action_status.style.display='block'
                action_status.classList.remove('alert-success')
                action_status.classList.add('alert-danger')
                action_status.innerHTML=error;
            })

        }else{
            action_status.style.display='block'
            action_status.classList.remove('alert-success')
            action_status.classList.add('alert-danger')
            action_status.innerHTML="Enter a valid Email Address"

        }

    })

    //managing users
    let recoveraccount = document.querySelectorAll('.recoveraccount')
    recoveraccount.forEach((action)=>{
        action.addEventListener('click',function(){
            this.innerHTML='<small>Recovering</small> <span class="spinner-border spinner-border-sm"></span>'
            fetch('/admins/recover-tipper/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:'email='+this.getAttribute('data-user')


            }).then((response)=>{
                if(response.status===200){
                    this.innerHTML='<small>Account Recovered Succesfully and Email Sent to user</small>'
                    window.location.reload()
                }else{
                    this.innerHTML='<small>Failed</small>'
                }
                setInterval(()=>{
                    this.innerHTML='<small>Recover</small>'
                  },5000)
            }).catch((error)=>{
               this.innerHTML='<small>Failed</small>'
               setInterval(()=>{
                 this.innerHTML='<small>Recover</small>'
               },1000)
            })
        })
    })
    let banaccount = document.querySelectorAll('.banaccount')
    banaccount.forEach((action)=>{
        action.addEventListener('click',function(){
            this.innerHTML='<small>Suspending<span class="spinner-border spinner-border-sm"></span></small> '
            fetch('/admins/ban-tipper/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:'email='+this.getAttribute('data-user')


            }).then((response)=>{
                if(response.status===200){
                    this.innerHTML='<small>Banned</small>'
                    window.location.reload()
                }else{
                    this.innerHTML='<small>Failed</small>'
                    setInterval(()=>{
                        this.innerHTML='<small>Ban</small>'
                      },5000)
                }
               
            }).catch((error)=>{
               this.innerHTML='<small>Failed</small>'
               setInterval(()=>{
                 this.innerHTML='<small>Ban</small>'
               },1000)
            })
        })

       
    })

    let deleteaccount = document.querySelectorAll('.deleteaccount')
    deleteaccount.forEach((action)=>{
        action.addEventListener('click',function(){
            this.innerHTML='<small>Deleting<span class="spinner-border spinner-border-sm"></span></small> '
            fetch('/admins/delete-tipper/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:'email='+this.getAttribute('data-user')


            }).then((response)=>{
                if(response.status===200){
                    this.innerHTML='<small>Deleted</small>'
                    window.location.reload()
                }else{
                    this.innerHTML='<small>Failed</small>'
                    setInterval(()=>{
                        this.innerHTML='<small>Delete</small>'
                      },5000)
                }
               
            }).catch((error)=>{
               this.innerHTML='<small>Failed</small>'
               setInterval(()=>{
                 this.innerHTML='<small>Delete</small>'
               },1000)
            })
        })
    })
}else if(currenturl.search('profile')>-1){

    //personal details
    let email = grabById('email');let name= grabById('fullname')
    let editemailbtn = grabById('editemail')
    let editnamebtn= grabById('editname')
    let personaldetailsstatus = grabById('psdetailsstatus')

    editemailbtn.addEventListener('click',function(){
       
        if(email.disabled===true){
            email.disabled=false
            this.innerHTML='<small>Save</small>'
        
        }else if(this.innerHTML==='<small>Save</small>'){
            
            if(has_valid_inputs(email.value)===true && has_invalid_characters(email.value)===false){
                personaldetailsstatus.style.display='block'
                personaldetailsstatus.classList.add('alert-success')
                personaldetailsstatus.classList.remove('alert-danger')
                personaldetailsstatus.innerHTML='<small>Updating </small><span class="spinner-border spinner-border-sm"></span>'
                fetch('/admins/profile-update/',{
                    method:'POST',
                    headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                    body:'email='+email.value+'&username=Null'
                }).then((response)=>{
                    this.innerHTML='<small>Edit</small>'
                    email.disabled=true
                    if(response.status===200){
                        personaldetailsstatus.style.display='block'
                        personaldetailsstatus.classList.add('alert-success')
                        personaldetailsstatus.classList.remove('alert-danger')
                        personaldetailsstatus.innerHTML='<small>Success. Email Updated Succesfully</small'
                        setInterval(()=>{
                            personaldetailsstatus.style.display='none'

                        },2000)
                        
                      
                    }else{
                        personaldetailsstatus.style.display='block'
                        personaldetailsstatus.classList.add('alert-danger')
                        personaldetailsstatus.classList.remove('alert-success')
                        response.text().then((error)=>{
                            personaldetailsstatus.innerHTML='<small>Error! '+error+'</small>'
                        })
                       
                    }
                  
                }).catch((error)=>{
                    personaldetailsstatus.style.display='block'
                    personaldetailsstatus.classList.add('alert-danger')
                    personaldetailsstatus.classList.remove('alert-success')
                    personaldetailsstatus.innerHTML='<small>Error! '+error+'</small>'
                })
            }else{
                personaldetailsstatus.style.display='block'
                personaldetailsstatus.classList.add('alert-danger')
                personaldetailsstatus.classList.remove('alert-success')
                personaldetailsstatus.innerHTML='<small>Failed. Invalid Email Address</small>'
                
            }
           
        }
    })
    editnamebtn.addEventListener('click',function(){
       
        if(name.disabled===true){
            name.disabled=false
            this.innerHTML='<small>Save</small>'
        
        }else if(this.innerHTML==='<small>Save</small>'){
            
            if(has_valid_inputs(name.value)===true && has_invalid_characters(name.value)===false){
                personaldetailsstatus.style.display='block'
                personaldetailsstatus.classList.add('alert-success')
                personaldetailsstatus.classList.remove('alert-danger')
                personaldetailsstatus.innerHTML='<small>Updating </small><span class="spinner-border spinner-border-sm"></span>'
                fetch('/admins/profile-update/',{
                    method:'POST',
                    headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                    body:'username='+name.value +'&email=Null'
                }).then((response)=>{
                    this.innerHTML='<small>Edit</small>'
                    name.disabled=true
                    if(response.status===200){
                        personaldetailsstatus.style.display='block'
                        personaldetailsstatus.classList.add('alert-success')
                        personaldetailsstatus.classList.remove('alert-danger')
                        personaldetailsstatus.innerHTML='<small>Success. Name Updated Succesfully to <span class="font-weight-bolder">@'+name.value+'</span></small'
                        setInterval(()=>{
                            personaldetailsstatus.style.display='none'

                        },2000)
                        
                      
                    }else{
                        personaldetailsstatus.style.display='block'
                        personaldetailsstatus.classList.add('alert-danger')
                        personaldetailsstatus.classList.remove('alert-success')
                        response.text().then((error)=>{
                            personaldetailsstatus.innerHTML='<small>Error! '+error+'</small>'
                        })
                        
                    }
                  
                }).catch((error)=>{
                    personaldetailsstatus.style.display='block'
                    personaldetailsstatus.classList.add('alert-danger')
                    personaldetailsstatus.classList.remove('alert-success')
                    personaldetailsstatus.innerHTML='<small>'+error+'</small>'
                })
            }else{
                personaldetailsstatus.style.display='block'
                personaldetailsstatus.classList.add('alert-danger')
                personaldetailsstatus.classList.remove('alert-success')
                personaldetailsstatus.innerHTML='<small>Failed! Invalid Name</small>'
                
            }
           
        }
    })

    //update password
    let updatepasswordform = grabById('upatepassword')
    let forminputs = updatepasswordform.querySelectorAll('input')
    let passwordtoggle= updatepasswordform.querySelectorAll('.passwordtoggle')

    passwordtoggle.forEach((button)=>{
    
        button.addEventListener('click',function(){
  
            if(grabById(this.getAttribute('data-password')).type==='password'){
                this.innerHTML='<small>Hide</small>'
                grabById(this.getAttribute('data-password')).type='text'
            }else if(grabById(this.getAttribute('data-password')).type==='text'){
                this.innerHTML='<small>Show</small>'
              grabById(this.getAttribute('data-password')).type='password'
            }
          })
    })

    forminputs.forEach(function(input){
        input.addEventListener('keyup',function(){
            if(has_invalid_characters(this.value)===true){
                this.value=this.value.replace(this.value[this.value.length-1],'')
            }
        })
    })

    let passwordupdateStatus = updatepasswordform.querySelector('#passwordUpdate')
    updatepasswordform.addEventListener('submit',function(e){
        e.preventDefault()
        document.querySelector('body').scrollTop=0
        if(has_valid_inputs(forminputs[0].value)===true && forminputs[0].value!==forminputs[1].value){
            if(has_valid_inputs(forminputs[1].value)===true && forminputs[1].value.length>7){
                if(forminputs[1].value===forminputs[2].value){
                    
                    passwordupdateStatus.style.display='block'
                    passwordupdateStatus.classList.add('alert-success')
                    passwordupdateStatus.classList.remove('alert-danger')
                    passwordupdateStatus.innerHTML='<small>Updating password. Please wait </small><span class="spinner-border spinner-border-sm"></span>'
                
                   //send to server
                   let to_send_data="old_password="+forminputs[0].value+'&new_password1='+forminputs[1].value+'&new_password2='+forminputs[1].value
                   fetch('/admins/change-password/',{
                       method:'POST',
                       headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                       body:to_send_data
                   }).then((response)=>{
                       if(response.status===200){
                        passwordupdateStatus.style.display='block'
                        passwordupdateStatus.classList.add('alert-success')
                        passwordupdateStatus.classList.remove('alert-danger')
                        passwordupdateStatus.innerHTML='<small>Success! Your password has been updated succesfully.</small>'
                         forminputs.forEach((input)=>{
                             input.value=''
                         })
                         setTimeout(()=>{
                            passwordupdateStatus.style.display='none'
                         },6000)
                        
                       }else{
                        passwordupdateStatus.style.display='block'
                        passwordupdateStatus.classList.remove('alert-success')
                        passwordupdateStatus.classList.add('alert-danger')
                        response.text().then((error)=>{
                            passwordupdateStatus.innerHTML='<small>Failed! '+error
                        })
                        
                
                       }
                   }).catch((error)=>{
                    passwordupdateStatus.style.display='block'
                    passwordupdateStatus.classList.remove('alert-success')
                    passwordupdateStatus.classList.add('alert-danger')
                    passwordupdateStatus.innerHTML='<small>Failed! '+error
                   }) 
                }else{
                    passwordupdateStatus.style.display='block'
                    passwordupdateStatus.classList.remove('alert-success')
                    passwordupdateStatus.classList.add('alert-danger')
                    passwordupdateStatus.innerHTML='<small>Error. Confirmation password does not match desired password</small>'
            
                }
    
            }else{
                 passwordupdateStatus.style.display='block'
                 passwordupdateStatus.classList.remove('alert-success')
                 passwordupdateStatus.classList.add('alert-danger')
                 passwordupdateStatus.innerHTML='<small>Error! Password Must ...<br>- Contain 8 or more characters<br>-Include letters and Letters <br>- Not be easy to guess or too common</small>'
            }   
        }else{
                    passwordupdateStatus.style.display='block'
                    passwordupdateStatus.classList.remove('alert-success')
                    passwordupdateStatus.classList.add('alert-danger')
                    passwordupdateStatus.innerHTML='<small>Enter a valid old password<br>Old password cannot be same as new password</small>'
              
        }
   
        

    })

    //delete account 
    let deleteaccount = grabById('deleteaccount')
    let togglerpass = grabById('del_confirm_password_toggle')
    let passwordfield = grabById('del_conf_password')
    togglerpass.addEventListener('click',function(){
        
      if(passwordfield.type==='password'){
          passwordfield.type='text'
          this.innerHTML='Hide'
          
      }else if(passwordfield.type==='text'){
          passwordfield.type='password'
          this.innerHTML='Show'

      }
        

    })
   let delstatus =grabById('delstatus')
    deleteaccount.addEventListener('submit',function(e){
        e.preventDefault()
        
        if(has_valid_inputs(passwordfield.value)===true && has_invalid_characters(passwordfield.value)===false ){
            delstatus.style.display='block'
            delstatus.classList.remove('alert-danger')
            delstatus.classList.add('alert-success')
            delstatus.innerHTML='<small>Processing Request </small><span class="spinner-border spinner-border-sm"></span>'

            fetch('/admins/delete-account/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:'password='+passwordfield.value

            }).then((response)=>{
                if(response.status===200){
                    delstatus.style.display='block'
                    delstatus.classList.remove('alert-danger')
                    delstatus.classList.add('alert-success')
                    delstatus.innerHTML='<small>Success! Account Deleted Succesfully</small>'
                    passwordfield.value=''
        
                }else{
                    delstatus.style.display='block'
                    delstatus.classList.remove('alert-success')
                    delstatus.classList.add('alert-danger')
                    response.text().then((error)=>{
                        delstatus.innerHTML='<small>Error! '+error+'</small>'
                    })
                    
                }

            }).catch((error)=>{
                delstatus.style.display='block'
                delstatus.classList.remove('alert-success')
                delstatus.classList.add('alert-danger')
                delstatus.innerHTML='<small>Error! '+error+'</small>'
            })
        }else{
            delstatus.style.display='block'
            delstatus.classList.remove('alert-success')
            delstatus.classList.add('alert-danger')
            delstatus.innerHTML='<small>Enter valid Password characters</small>'

        }
    }) 
}else if(currenturl.search('competitions')>-1){
    //search competitions
    let searchinput = grabById('search_comp');searchbtn = grabById('search_comp_btn')
    let search_comp_result = grabById('search_comp_result');let noresult = grabById('noresult')
    let search_countries = grabById('search_countries');let leagueselect = grabById('leagueselect')
    let search_leagues = grabById('search_leagues');let countryeselect = grabById('countryeselect')
    

    searchinput.addEventListener('keyup',function(){
        if(has_invalid_characters(this.value)===true){
            this.value = this.value.replace(this.value[this.value.length-1],'')
        }else{
            searchinput.style.border="1px solid blue"
        }

    })
    searchbtn.addEventListener('click',function(e){
        e.preventDefault()
        document.querySelector('body').scrollTop=0
        if(has_valid_inputs(searchinput.value)===true){
            searchinput.style.border="1px solid blue"
                  this.innerHTML='<small>Searching </small><span class="spinner-border spinner-border-sm"></span>'
                  fetch('/admins/getcompetition?q='+searchinput.value).then((response)=>{
                      if(response.status===200){
                        return response.json()
                      }else{
                        return false
                      }
                     
                  }).then((mydata)=>{
                    if(mydata===false){
                        this.innerHTML='Failed'
                    }else{
                        this.innerHTML='<small>Success</small>'
                        searchinput.value=''
                        search_comp_result.style.display='block'
                        //append if countries found
                   
                        if(mydata.countries.length>0 && mydata.leagues.length>0){
                            
                          document.querySelectorAll('.search_res_val')[0].style.display='inherit'
                          search_countries.innerHTML=mydata.countries.length
                          search_leagues.innerHTML=mydata.leagues.length
                        
                          let countrytoadd='<option id="default">--View Countries--</option>'
                       
                          for(i=0;i<mydata.countries.length;i++){
                              countrytoadd=countrytoadd+'<option value="'+mydata.countries[i]+'">'+mydata.countries[i]+'</option>'
                          }
                         
                          countryeselect.style.display='block'
                          countryeselect.innerHTML=countrytoadd
                          let leaguestoadd='<option id="default">--View Leagues--</option>'
                          for(i=0;i<mydata.leagues.length;i++){
                              leaguestoadd=leaguestoadd+'<option value="'+mydata.leagues[i]+'">'+mydata.leagues[i]+'</option>'
                          }
                          leagueselect.style.display='block'
                          leagueselect.innerHTML=leaguestoadd
                        }else if(mydata.countries.length>0 && mydata.leagues.length<1){
                            document.querySelectorAll('.search_res_val')[0].style.display='inherit'
                            search_countries.innerHTML=mydata.countries.length
                            search_leagues.innerHTML='0'
                            let countrytoadd='<option id="default">--View Countries--</option>'
                       
                            for(i=0;i<mydata.countries.length;i++){
                                countrytoadd=countrytoadd+'<option value="'+mydata.countries[i]+'">'+mydata.countries[i]+'</option>'
                            }
                           
                            countryeselect.style.display='block'
                            countryeselect.innerHTML=countrytoadd
                        }else if(mydata.countries.length<1 && mydata.leagues.length>0){
                            document.querySelectorAll('.search_res_val')[0].style.display='inherit'
                            search_countries.innerHTML='0'
                            search_leagues.innerHTML=mydata.leagues.length
                            let leaguestoadd='<option id="default">--View Leagues--</option>'
                            for(i=0;i<mydata.leagues.length;i++){
                                leaguestoadd=leaguestoadd+'<option value="'+mydata.leagues[i]+'">'+mydata.leagues[i]+'</option>'
                            }
                            leagueselect.style.display='block'
                            leagueselect.innerHTML=leaguestoadd
                        }else{
                            noresult.style.display='block'
                        }
                        setTimeout(()=>{
                            this.innerHTML='<small>Search ...</small>'
                        },3000)
                    }
                  }).catch((e)=>{
                        this.innerHTML='Failed'
                  })
        }else{
            searchinput.style.border="1px solid red"
        }

    })

    //add country
    let addcountrystatus = grabById('add-country-status')
    let addcountry = grabById('addcountry')
    let addcountrybtn = grabById('addcountrybtn')

    grabById('addcountryform').addEventListener('submit',function(e){
        e.preventDefault()
        document.querySelector('body').scrollTop=0
        if(has_invalid_characters(addcountry.value)===false && has_valid_inputs(addcountry.value)===true){
            addcountrystatus.style.display='block'
            addcountrystatus.classList.remove('alert-danger')
            addcountrystatus.classList.add('alert-success')
            addcountrystatus.innerHTML='<small>Adding Country.Please wait <span class="spinner-border spinner-border-sm"></span></small>'
            this.disabled=true
             let formdata = new FormData()
             formdata.append('country',addcountry.value)
             let data = $('#addcountryform').serialize()
             console.log( $('#addcountryform'))
           
            fetch('/admins/addcountry/',{
                method:'POST',
                body:data,
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value}
            }).then((response)=>{
                this.disabled=false
                if(response.status===200){
                    addcountrystatus.style.display='block'
                    addcountrystatus.classList.remove('alert-danger')
                    addcountrystatus.classList.add('alert-success')
                    addcountrystatus.innerHTML='<small>'+addcountry.value+' added Succesfully</small>'
                    addcountry.value=''
                    setTimeout(()=>{
                        addcountrystatus.style.display='none'
                        
                    },4000)
                   
                }else{
                    addcountrystatus.style.display='block'
                    addcountrystatus.classList.remove('alert-success')
                    addcountrystatus.classList.add('alert-danger')
                    response.text().then((text)=>{
                        addcountrystatus.innerHTML='<small>Error! '+text+'</small>'
                    })
                    
                    setTimeout(()=>{
                        addcountrystatus.style.display='none'
                       
                    },4000)
                }
            }).catch((error)=>{
                this.disabled=false
                addcountrystatus.style.display='block'
                addcountrystatus.classList.remove('alert-success')
                addcountrystatus.classList.add('alert-danger')
                addcountrystatus.innerHTML='<small>Error! '+error+'</small>'

            })
        }else{
            addcountrystatus.style.display='block'
            addcountrystatus.classList.remove('alert-success')
            addcountrystatus.classList.add('alert-danger')
            addcountrystatus.innerHTML='<small>Enter a valid country</small>'
        }
    })

    //add league
    let addleaguebtn = grabById('addleaguebtn')
    let toaddcountry = grabById('country-selected')
    let leaguename = grabById('leaguename')
    let add_league_status = grabById('add-league-status')

    grabById('addleagueform').addEventListener('submit',function(e){
        e.preventDefault()
        document.querySelector('body').scrollTop=0
        if(has_valid_inputs(toaddcountry.value)===true && has_invalid_characters(toaddcountry.value)===false && has_valid_inputs(leaguename.value)===true && has_invalid_characters(leaguename.value)===false){
            
            add_league_status.style.display='block'
            add_league_status.classList.remove('alert-danger')
            add_league_status.classList.add('alert-success')
            add_league_status.innerHTML='<small>Adding League.Please wait <span class="spinner-border spinner-border-sm"></span></small>'
            this.disabled=true
            let data = $('#addleagueform').serialize()
            fetch('/admins/addleague/',{
                method:'POST',
                headers:{'Content-type':'application/x-www-form-urlencoded','X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body: data 
            }).then((response)=>{
                this.disabled=false
                if(response.status===200){
                    add_league_status.classList.remove('alert-danger')
                    add_league_status.classList.add('alert-success')
                    add_league_status.innerHTML='<small>'+leaguename.value+' league from '+toaddcountry.value+' added succesfully</small>'
                    toaddcountry.value='default'
                    leaguename.value=''

                    setTimeout(()=>{
                        add_league_status.style.display='none'
                        
                        
                    },4000)
                }else{
                    
                    add_league_status.classList.remove('alert-success')
                    add_league_status.classList.add('alert-danger')
                    response.text().then((text)=>{
                        add_league_status.innerHTML='<small>Error! '+ text +'</small>'
                    })
                    
                    setTimeout(()=>{
                        add_league_status.style.display='none'
                       
                    },6000)
                }
           }).catch((error)=>{
               this.disabled=false
                add_league_status.classList.remove('alert-success')
                add_league_status.classList.add('alert-danger')
                add_league_status.innerHTML='<small>Error! '+error+'</small>'
            })  
        }else{
          
         
            add_league_status.style.display='block'
            add_league_status.classList.remove('alert-success')
            add_league_status.classList.add('alert-danger')
            add_league_status.innerHTML='<small>Enter a valid Country and League</small>'
        }
    })
    
}
   
    

})