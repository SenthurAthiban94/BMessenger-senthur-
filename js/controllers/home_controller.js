var contactshome=angular.module('Contactshome',['contact_services']);
contactshome.controller('home_controller',['$scope','$http','$window','database',function($scope,$http,$window,database){
    $scope.userdata=JSON.parse(sessionStorage.userDataObJect);
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
	$scope.refreshcontacts=function(){
        $('#noresults').hide();
        $scope.retrivedcontacts=[];
        $('#loaderbackground').show();
        if($scope.displaynames==$scope.devicecontactsnames)
        {
//            $scope.gotContacts();
    		navigator.contacts.find([navigator.contacts.fieldType.displayName],$scope.gotContacts,$scope.errorHandler);  
        }
        else if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.getuploadedcontacts(); 
        }
        else
        {
            $('#loaderbackground').hide();
        }
	};
    
    $scope.actiontobeperformedonallcontacts=function(){
        $('#loaderbackground').show();
        if($scope.displaynames==$scope.devicecontactsnames)
        {
              $scope.uploadallcontactstodatabase();
        }
        else if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.deleteallcontactsfromdatabase();
        }
        else
        {
            $('#loaderbackground').hide();
        }
    };
    $scope.actiontobeperformedonthiscontact=function($contact){
        $('#loaderbackground').show();
        if($scope.displaynames==$scope.devicecontactsnames)
        {
              $scope.uploadcontacttodatabase($contact);
        }
        else if($scope.displaynames==$scope.uploadedcontactsnames)
        {
            $scope.deletecontactfromdatabase($contact);
        }
        else
        {
            $('#loaderbackground').hide();
        }
    };
	$scope.gotContacts=function(c){
         $scope.count=0;
         /* Retriving phoneNumbers */
         for(var i=0,len=c.length; i<len;i++) {     //;i<5;i++){ 
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                var localcontact={};
                    $scope.count=$scope.count+1;
                    localcontact.contactName=c[i].displayName; //"senthur";//
                    localcontact.contactNo=c[i].phoneNumbers[0].value; //"+91 9252-4898-941";//
                    $scope.retrivedcontacts.push(localcontact);
             }
         }
         $scope.$apply();
         if($scope.count<1)//c.length==0)
         {
             $('#noresults').show();
         }
         $('#loaderbackground').hide();  
	};
	$scope.errorHandler=function(error){
		console.log("errorHandler: "+e);
	};
    $scope.getuploadedcontacts=function(){
        $http(database.viewcontacts($scope.userdata.usermail)).success(function($data){
            if(($data.Contacts) && ($data.status==1)){
                $scope.retrivedcontacts=$data.Contacts;
            }
            else{
                alert("Contacts Retrival Failed!!");
            }
            if(!$data.Contacts.length){$('#noresults').show();};
            $scope.$apply();
            $('#loaderbackground').hide();
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });
    };
    
    
    $scope.uploadallcontactstodatabase=function(){
        $http(database.uploadcontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            alert($data.msg);
            $('#loaderbackground').hide(); 
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });  
    };
    $scope.uploadcontacttodatabase=function($contact){
        var uploadthiscontact=[];
        alert(JSON.stringify($contact));
        uploadthiscontact.push($contact);
        $http(database.uploadcontacts($scope.userdata.usermail,uploadthiscontact)).success(function($data){
            alert($data.msg);
            $('#loaderbackground').hide();
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });  
    };
    $scope.deleteallcontactsfromdatabase=function(){
        $http(database.deletecontacts($scope.userdata.usermail,$scope.retrivedcontacts)).success(function($data){
            alert(JSON.stringify($data));
            if($data.status==1)
            {
                alert("All Contact Deleted Successfully"); 
            }
            $scope.refreshcontacts();
            $('#loaderbackground').hide();
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });
    };
    $scope.deletecontactfromdatabase=function($contact){
        var deletethiscontact=[];
        deletethiscontact.push($contact);
        $http(database.deletecontacts($scope.userdata.usermail,deletethiscontact)).success(function($data){
            alert(JSON.stringify($data));
            if($data.status==1)
            {
                alert("All Contact Deleted Successfully");
            }
            $scope.refreshcontacts();
            $('#loaderbackground').hide();
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });
    };
    $scope.logout=function(){
        $http(database.logoutuser($scope.userdata.usermail)).success(function($data){
            alert(JSON.stringify($data));
            if($data.status==1)
            {
                alert("Successfully LoggedOut!!");
                $scope.userdata={};
                sessionStorage.userDataObJect='';
                $scope.redirect();
            }
            $('#loaderbackground').hide();
        }).error(function(err){
            alert(JSON.stringify(err));
            $('#loaderbackground').hide();
        });  
    };
    $scope.redirect = function(){
      $window.location='login.html';
    }
}]);