/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var contact_App=angular.module('Contacts_sync',['contact_services']);
    contact_App.controller('Contacts_sync_controller',['$scope','$http','$window','database',function($scope,$http,$window,database){
        $scope.redirect = function(){
          $window.location='home.html';
        };
        $scope.goBack = function (evt) {
            if (evt != null) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        document.addEventListener("backbutton", $scope.goBack, false);
        $scope.userdata={};
//        $scope.AlertHandler=function(){
//            
//        };
        $scope.signup=function(){
            $scope.signuploading=true;
//           alert($scope.username+","+$scope.signup_password+","+$scope.signup_email+","+$scope.phonumber);
//           navigator.notification.alert("This is the User data: "+$scope.username+","+$scope.signup_password+","+$scope.signup_email+","+$scope.phonumber, $scope.AlertHandler, "User Details", "Exit");
           if(($scope.username) && ($scope.signup_password) && ($scope.signup_email) && ($scope.phonumber))
           {
               $scope.validate=false;
               $http(database.signup($scope.username,$scope.signup_password,$scope.signup_email,$scope.phonumber)).success(function($data){
                if($data.status==1)
                {
                    $scope.userdata.username=$data.username;
                    $scope.userdata.usermail=$data.usermail;
                    $scope.userdata.userid=$data.userid;
                    sessionStorage.userDataObJect=JSON.stringify($scope.userdata);
                    alert($data.msg);
                    $scope.submittedsignup=false;
                    $scope.signuploading=false;
                    $scope.redirect();
                }
                else
                {
                    alert($data.msg);
                    $scope.signuploading=false;
                    $scope.submittedsignup=false;
                }
               }).error(function(err){
                   if(err==""){
                       alert("Check your Internet Connection!!");
                       $scope.signuploading=false;
                   }
                   else{
                       $scope.signuploading=false;
                       $scope.submittedsignup=false;
                       alert("Error During Signup Try Again Later");
                   }
               });
           }
           else{
               $scope.validate=true;$scope.submittedsignup=false;
               $scope.signuploading=false;
           } 
        };
        $scope.login=function(){
            $scope.loginloading=true;
            if($scope.login_mail){
                $scope.validateemail=false;
                $http(database.login($scope.login_mail,$scope.login_password)).success(function($data){
                    if($data.status==1)
                    {
                        $scope.validate=false;
                        $scope.userdata.username=$data.username;
                        $scope.userdata.usermail=$data.usermail;
                        $scope.userdata.userid=$data.userid;
                        $scope.userdata.contacts=$data.Contacts;
                        sessionStorage.userDataObJect=JSON.stringify($scope.userdata);
                        $scope.submitted=false;
                        $scope.loginloading=false;
                        $scope.redirect();
                    }
                    else{$scope.validate=true;$scope.submitted=false;$scope.loginloading=false;}
               }).error(function(err){
                   if(err==""){
                       alert("Check your Internet Connection!!");
                       $scope.loginloading=false;
                   }else{
                       alert("Error During Login Try Again Later");
                       $scope.submitted=false;
                       $scope.loginloading=false;
                   }
               });       
            }else{$scope.validateemail=true;$scope.submitted=false;}
        };
        
        if(sessionStorage.userDataObJect){
            $scope.redirect();
        }    
    }]);

