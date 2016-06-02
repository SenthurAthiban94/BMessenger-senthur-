/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var contact_App=angular.module('Contacts_sync',['contact_services']);

    contact_App.controller('Contacts_sync_controller',['$scope','$http','$window','database',function($scope,$http,$window,database){     
        $scope.signup=function(){
           alert($scope.username+","+$scope.signup_password+","+$scope.signup_email+","+$scope.phonumber);
           if(($scope.username) && ($scope.signup_password) && ($scope.signup_email) && ($scope.phonumber))
           {
               $scope.validate=false;
               $http(database.signup($scope.username,$scope.signup_password,$scope.signup_email,$scope.phonumber)).success(function($data){
                alert(JSON.stringify($data.msg));
                $scope.redirect();
               }).error(function(err){
                   alert("Error During Signup Try Again Later");
               });
           }
           else{
               $scope.validate=true;
           } 
        };
        $scope.login=function(){
            if($scope.login_mail){
                $scope.validateemail=false;
                $http(database.login($scope.login_mail,$scope.login_password)).success(function($data){
                    if($data.status==1)
                    {
                        $scope.validate=false;
                        alert("Logged In Successfully");
                        $scope.redirect();
                    }
                    else{$scope.validate=true;}
               }).error(function(err){
                   alert("Error During Login Try Again Later");
               });       
            }else{$scope.validateemail=true;}
        };
        
        
        
        $scope.redirect = function(){
          $window.location='./home.html';
        }    
    }]);

