var contactshome=angular.module('Contactshome',['contact_services']);
    contactshome.filter('removeSpaces', [function() {
        return function(string) {
            if (!angular.isString(string)) {
                return string;
            }
            return string.replace(/[\s]/g, '');
        };
    }]);
    
contactshome.controller('home_controller',['$scope','$http','$window','database',function($scope,$http,$window,database){
    $scope.loadingimage=true;
    $scope.redirect = function(){
        $window.location='login.html';
    };
    if(!sessionStorage.userDataObJect){
        $scope.redirect();
    }
    $scope.userdata=JSON.parse(sessionStorage.userDataObJect);
    $scope.menuonecount=0;$scope.menutwocount=0;
    $scope.selectmenuitem=function(itemselected){
        if(itemselected==1){$scope.selecteditem1='active';$scope.selecteditem2='';$scope.selecteditem3='';$scope.selecteditem4='';}
        else if(itemselected==2){$scope.selecteditem1='';$scope.selecteditem2='active';$scope.selecteditem3='';$scope.selecteditem4='';}
        else if(itemselected==3){$scope.selecteditem1='';$scope.selecteditem2='';$scope.selecteditem3='active';$scope.selecteditem4='';}
        else{$scope.selecteditem1='';$scope.selecteditem2='';$scope.selecteditem3='';$scope.selecteditem4='active';}  
    };
    $scope.displaynames={}; 
    $scope.devicecontactsnames={
        "title" :"Device Contacts",
        "refresh" :"Refresh",
        "selectall" : "Upload All",
        "select" : "Upload",
        "style" : "btn-warning"
    };
    $scope.uploadedcontactsnames={
        "title" :"Uploaded Contacts",
        "refresh" :"Refresh",
        "selectall" : "Delete All",
        "select" : "Delete",
        "style" : "btn-danger"
    };
    $scope.Googlecontactsnames={
        "title" :"Google Contacts"
//        "refresh" :"Refresh",
//        "selectall" : "Delete All",
//        "select" : "Delete",
//        "style" : "btn-danger"
    };
    $scope.checkfirstselected=function($selectedmenu){
        if($selectedmenu<2)
        {
            $scope.loadingimage=true;
            $scope.menutwocount=0;
            $scope.searchtext="";
            $scope.refreshcontacts();   
        }
        else{
            $scope.loadingimage=false;   
        }
    };
    $scope.checksecondselected=function($selectedmenu){
        if($selectedmenu<2)
        {
            $scope.menuonecount=0;
            $scope.searchtext="";
            $scope.refreshcontacts();   
        }
        else{
            $scope.loadingimage=false;
        }
    };
    $scope.checkthirdselected=function(){
        $scope.menuonecount=0;
        $scope.menutwocount=0;
        if(!$scope.googlecontacts)
        {
            $scope.searchtext="";
            $scope.refreshcontacts();
        }
        else{
            $scope.retrivedcontacts=$scope.gotgooglecontacts.Contacts;
        }
    };
    $scope.checkbackgroundopertion=function($status,$listlength){
        if($status || !$listlength){
            return true;
        }  
        else{
            return false;
        }
    };
    /////////////////////////////////////////////  GOOGLE API  /////////////////////////////////////////////////////        
        $scope.auth=function($email) {
    	    var config = {
//              'client_id':  '321489143617-4t5duhhnu6q6oeijdnlqseqgef7726ob.apps.googleusercontent.com',         //Android
    	      'client_id': '321489143617-9jn1c4a3b26q6mt4319gnv3a0t0ckafp.apps.googleusercontent.com',        // Web app
    	      'scope': 'https://www.google.com/m8/feeds'
    	    };
    	    gapi.auth.authorize(config, function() {
    	      $scope.fetch($email,gapi.auth.getToken()); 
    	    });
    	  };
    	  $scope.fetch=function($email,token) {
    	    $.ajax({
    		    url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token.access_token + "&max-results=50000&alt=json",
    		    dataType: "jsonp",
    		    success:function(data) {
                          // display all your data in console
                          $scope.googlecontacts=true;
                          //$scope.google_contacts_entire_details=data;
                          $scope.gotgooglecontacts={};
                          $scope.gotgooglecontacts.Contacts=[];
                          $scope.gotgooglecontacts.title=data.feed.title.$t;
                          $scope.gotgooglecontactsobject=data.feed.entry;
                          var numberofcontacts=$scope.gotgooglecontactsobject.length;
                          for(var i=0; i<numberofcontacts;i++) {  
                             if($scope.gotgooglecontactsobject[i].title && $scope.gotgooglecontactsobject[i].gd$phoneNumber) {
                                     var noofnumbers=$scope.gotgooglecontactsobject[i].gd$phoneNumber.length;
                                     for(var j=0;j<noofnumbers;j++)
                                     {
                                         var localcontact={};
                                             localcontact.contactName=$scope.gotgooglecontactsobject[i].title.$t; //"senthur";//
                                             if($scope.gotgooglecontactsobject[i].gd$phoneNumber[j].uri)
                                             {
                                                 $scope.gotgooglecontactsobject[i].gd$phoneNumber[j].uri=$scope.gotgooglecontactsobject[i].gd$phoneNumber[j].uri.substr(4);
                                                 localcontact.contactNo=$scope.gotgooglecontactsobject[i].gd$phoneNumber[j].uri; //"+91 9252-4898-941";//
                                             }
                                             else{
                                                 localcontact.contactNo=$scope.gotgooglecontactsobject[i].gd$phoneNumber[j].$t;
                                             }
                                             $scope.gotgooglecontacts.Contacts.push(localcontact);
                                     }
                              }
                          }
                          $scope.retrivedcontacts=$scope.gotgooglecontacts.Contacts;
                          $scope.uploadallcontactstodatabase();
                          $scope.loadingimage=false;
                          $scope.$apply();
//    		              console.log(JSON.stringify(data));
                          console.log(JSON.stringify($scope.gotgooglecontacts));
    		    },
    			error : function(e){
                    $scope.googlecontacts=false;
    				console.log("Authentication Failed"+JSON.stringify(e));
    			}
    		});
    	};
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.refreshcontacts=function(){
        $('#noresults').hide();
        $scope.loadingimage=true;
        $scope.Checkuploadedcontacts();  
        $scope.retrivedcontacts=[];
        $scope.$apply();
        if($scope.displaynames==$scope.devicecontactsnames)
        {
    		navigator.contacts.find([navigator.contacts.fieldType.displayName],$scope.gotContacts,$scope.errorHandler);  
        }
        if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.getuploadedcontacts();
        }
        if($scope.displaynames==$scope.Googlecontactsnames){
          $scope.auth($scope.userdata.usermail);
        };
	};
    
    $scope.actiontobeperformedonallcontacts=function(){
        $scope.loadingimage=true;
        $scope.operationperforming=true;
        if($scope.displaynames==$scope.devicecontactsnames)
        {
              alert("Performing Background Upload...");
              $scope.uploadallcontactstodatabase();
        }
        if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            alert("Performing Background Delete...");
            $scope.deleteallcontactsfromdatabase();
        }
    };
    $scope.actiontobeperformedonthiscontact=function($contact){
        $scope.loadingimage=true;
        if($scope.displaynames==$scope.devicecontactsnames)
        {
              $scope.uploadcontacttodatabase($contact);
        }
        else if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.deletecontactfromdatabase($contact);
        }
        else
        {}
    };
	$scope.gotContacts=function(c){
        $scope.displaymessage(c.length);
         /* Retriving phoneNumbers */
         for(var i=0,len=c.length; i<len;i++) {     //;i<5;i++){ 
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                var localcontact={};
                    localcontact.contactName=c[i].displayName; //"senthur";//
                    localcontact.contactNo=c[i].phoneNumbers[0].value; //"+91 9252-4898-941";//
                    $scope.retrivedcontacts.push(localcontact);
             }
         }
//         if(c.length==0)
//         {
//                $('#noresults').show();
//         }
         $scope.loadingimage=false;
         $scope.$apply();
	};
    $scope.displaymessage=function($valuelength){
        if($valuelength > 0)//c.length==0)
         {
             $('#noresults').hide();
         }
    };
	$scope.errorHandler=function(error){
		console.log("errorHandler: "+error);
        $scope.loadingimage=false;
	};
    $scope.getuploadedcontacts=function(){
        $http(database.viewcontacts($scope.userdata.usermail)).success(function($data){
            if(($data.Contacts) && ($data.status==1)){
                $scope.retrivedcontacts=$data.Contacts;
                if(!$scope.retrivedcontacts.length){$('#noresults').show();}
                $scope.loadingimage=false;
            }
            else{
                alert("Contacts Retrival Failed!!");
                $scope.loadingimage=false;
            }
        }).error(function(err){
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
            $scope.loadingimage=false;
        });
    };
    
    
    $scope.uploadallcontactstodatabase=function(){
        $scope.loadingimage=false;
        $http(database.uploadcontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            if(!$scope.googlecontacts){
               alert("Contacts Uploaded Successfully");   
            }
            $scope.loadingimage=false; 
            $scope.operationperforming=false;
        }).error(function(err){
            $scope.loadingimage=false;
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
            $scope.operationperforming=false;
        });  
    };
    $scope.uploadcontacttodatabase=function($contact){
        $scope.loadingimage=true;
        var uploadthiscontact=[];
        uploadthiscontact.push($contact);
        $http(database.uploadcontacts($scope.userdata.usermail,uploadthiscontact)).success(function($data){
            alert($data.msg);
            $scope.loadingimage=false;
        }).error(function(err){
            $scope.loadingimage=false;
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
        });  
    };
    $scope.Checkuploadedcontacts=function(){
        $http(database.viewcontacts($scope.userdata.usermail)).success(function($data){
            if(($data.Contacts) && ($data.status==1)){
                $scope.checkuploadedcontacts=$data.Contacts;
            }
            else{
                alert("Contacts Retrival Failed!!");
            }
        }).error(function(err){
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
        });
    };
    $scope.doesExist = function($contact) {
        if($scope.displaynames==$scope.devicecontactsnames){
            return $scope.checkuploadedcontacts.indexOf($contact) !== -1;   
        }
        else{
                return false;
        }
    };
    $scope.deleteallcontactsfromdatabase=function(){
        $scope.loadingimage=false;
        $http(database.deletecontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            if($data.status==1)
            {
                alert("All Contact Deleted Successfully"); 
            }
            $scope.operationperforming=false;
            $scope.loadingimage=false;
            $scope.refreshcontacts();
        }).error(function(err){
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
            $scope.operationperforming=false;
        });
    };
    $scope.deletecontactfromdatabase=function($contact){
        $scope.loadingimage=true;
        var deletethiscontact=[];
        deletethiscontact.push($contact);
        $http(database.deletecontacts($scope.userdata.usermail,deletethiscontact)).success(function($data){
            if($data.status==1)
            {
                alert("Contact Deleted Successfully");
                $scope.remove($contact);
                $scope.loadingimage=false;
            }
            if($scope.searchtext){
                $scope.refreshcontacts();   
            }
        }).error(function(err){
            $scope.loadingimage=false;
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
        });
    };
    $scope.remove = function(contact){
        $scope.retrivedcontacts.splice($scope.retrivedcontacts.indexOf(contact),1);
    };
    $scope.logoutsession=function(){
        $scope.loadingimage=true;
        $http(database.logout($scope.userdata.usermail)).success(function($data){
                    if($data.status==1)
                    {
                        $scope.userdata={};
                        sessionStorage.userDataObJect='';
                        $scope.googlelogout=true;
                        $scope.redirect();
                        $scope.loadingimage=false;
                    }
                    else
                    {
                        alert(JSON.stringify($data));
                        $scope.loadingimage=true;
                    }
               }).error(function(err){
                   if(err==""){
                         alert("Check your Internet Connection!!");
                    }else{alert(JSON.stringify(err));}
                    $scope.loadingimage=false;
               });   
    };
}]);