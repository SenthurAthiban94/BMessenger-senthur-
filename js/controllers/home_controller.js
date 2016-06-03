var contactshome=angular.module('Contactshome',[]);
contactshome.controller('home_controller',['$scope',function($scope){
	$scope.refreshcontacts=function(){
        $('#loaderbackground').show();
		navigator.contacts.find([navigator.contacts.fieldType.displayName],$scope.gotContacts,$scope.errorHandler);
	};
	$scope.gotContacts=function(c){
		 var tablebody = document.querySelector("#result");
         var count=0;
         /* Retriving phoneNumbers */
         for(var i=0, len=c.length; i<len; i++) {
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                tablebody.innerHTML += "<tr><td class=\"col-sm-1 col-xs-1 col-md-1\">"+(count=count+1)+"</td><td class=\"col-sm-10 col-xs-10 col-md-10\" style=\"font-size:16px;padding-left:4px;padding-right:2px;\"><div><div><b><span>Name</span>: </b><span style=\"padding-left:2px;\">"+c[i].displayName+"</span></div></div><div><div><b><span>Number</span>: </b><span style=\"padding-left:2px;\">"+c[i].phoneNumbers[0].value+"</span></div></div></td><td class=\"col-sm-1 col-xs-1 col-md-1\"style=\"padding-left:4px;padding-right:5px;padding-top:10px;padding-bottom:10px;\"><button type=\"button\" class=\"btn btn-warning\" style=\"height:35px;padding-top:2px;padding-bottom:2px;\">Upload</button></td></tr>";
             }
             $('#loaderbackground').show();
         }
         if(c.length==0)
         {
             $('#noresults').show();
         }
         $('#loaderbackground').hide();  
	};
	$scope.errorHandler=function(error){
		console.log("errorHandler: "+e);
	}	
}]);