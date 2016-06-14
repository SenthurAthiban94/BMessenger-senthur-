var contactshome=angular.module('Contactshome',['contact_services']);
contactshome.controller('home_controller',['$scope','$http','$window','database',function($scope,$http,$window,database){
    $scope.userdata=JSON.parse(sessionStorage.userDataObJect);
    $scope.menuonecount=0;$scope.menutwocount=0;
    $scope.loadingimage=true;
    if(!$scope.userdata){
        $scope.redirect();
    }
    $scope.selectmenuitem=function(itemselected){
        if(itemselected==1){$scope.selecteditem1='active';$scope.selecteditem2='';$scope.selecteditem3='';}
        else if(itemselected==2){$scope.selecteditem1='';$scope.selecteditem2='active';$scope.selecteditem3='';}
        else{$scope.selecteditem1='';$scope.selecteditem2='';$scope.selecteditem3='active';}  
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
    $scope.checkfirstselected=function($selectedmenu){
        if($selectedmenu<2)
        {
            $scope.loadingimage=true;
            $scope.menutwocount=0;
            $scope.refreshcontacts();   
        }
    };
    $scope.checksecondselected=function($selectedmenu){
        if($selectedmenu<2)
        {
            $scope.loadingimage=true;
            $scope.menuonecount=0;
            $scope.refreshcontacts();   
        }
    };
	$scope.refreshcontacts=function(){
        $('#noresults').hide();  
        $scope.retrivedcontacts=[];
        if($scope.displaynames==$scope.devicecontactsnames)
        {
            $scope.loadingimage=true;
    		navigator.contacts.find([navigator.contacts.fieldType.displayName],$scope.gotContacts,$scope.errorHandler);  
        }
        if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.loadingimage=true;
            $scope.getuploadedcontacts();
        }
	};
    
    $scope.actiontobeperformedonallcontacts=function(){
        $scope.loadingimage=true;
        if($scope.displaynames==$scope.devicecontactsnames)
        {
              $scope.uploadallcontactstodatabase();
        }
        if($scope.displaynames==$scope.uploadedcontactsnames)
        {
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
        $scope.loadingimage=true;
         /* Retriving phoneNumbers */
         for(var i=0,len=c.length; i<len;i++) {     //;i<5;i++){ 
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                var localcontact={};
                    localcontact.contactName=c[i].displayName; //"senthur";//
                    localcontact.contactNo=c[i].phoneNumbers[0].value; //"+91 9252-4898-941";//
                    $scope.retrivedcontacts.push(localcontact);
             }
         }
         if(c.length < 1)//c.length==0)
         {
             $('#noresults').show();  
             $scope.loadingimage=false;
         }
         else{
             $('#noresults').hide(); 
             $scope.loadingimage=false; 
         }
	};
	$scope.errorHandler=function(error){
		console.log("errorHandler: "+error);
        $scope.loadingimage=false;
	};
    $scope.getuploadedcontacts=function(){
        $scope.loadingimage=true;
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
        $scope.loadingimage=true;
        $http(database.uploadcontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            alert("Contacts Uploaded Successfully");
            $scope.loadingimage=false; 
        }).error(function(err){
            $scope.loadingimage=false;
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
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
    $scope.deleteallcontactsfromdatabase=function(){
        $scope.loadingimage=true;
        $http(database.deletecontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            if($data.status==1)
            {
                alert("All Contact Deleted Successfully"); 
            }
            $scope.loadingimage=false;
            $scope.refreshcontacts();
        }).error(function(err){
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
             $scope.loadingimage=false;
        });
    };
    $scope.deletecontactfromdatabase=function($contact){
        $scope.loadingimage=true;
        var deletethiscontact=[];
        deletethiscontact.push($contact);
        $http(database.deletecontacts($scope.userdata.usermail,deletethiscontact)).success(function($data){
            if($data.status==1)
            {
                $scope.refreshcontacts();
                alert("Contact Deleted Successfully");
            }
            $scope.loadingimage=false;
        }).error(function(err){
            $scope.loadingimage=false;
            if(err==""){
                 alert("Check your Internet Connection!!");
            }else{alert(JSON.stringify(err));}
        });
    };
    $scope.logoutsession=function(){
        $scope.loadingimage=true;
        $http(database.logout($scope.userdata.usermail)).success(function($data){
                    if($data.status==1)
                    {
                        alert("Logged out Successfully");
                        $scope.userdata={};
                        sessionStorage.userDataObJect='';
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
    $scope.redirect = function(){
      $window.location='login.html';
    };
}]);