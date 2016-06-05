/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var api_service=angular.module('contact_services',[]);
    var header={
                 "Content-Type": "application/json"
                };
    api_service.factory('database',function(){
        var database={};
            database.signupURL="http://localhost/phpservice/services/signup.php";
            database.loginURL="http://localhost/phpservice/services/login.php";
            database.viewcontactsURL="http://localhost/phpservice/services/retrivecontacts.php";
            database.uploadcontactsURL="http://localhost/phpservice/services/uploadcontacts.php";
            database.deletecontactsURL="http://localhost/phpservice/services/deletecontacts.php";
            database.logoutURL="http://localhost/phpservice/services/logout.php";
            
            database.login=function($usermail,$password){
                var datavalue={
                                "usermail" : $usermail,
                                "password" : $password
                                };
                var req={
                            method : 'POST',
                            url : database.loginURL,
                            headers : header,
                            data : datavalue
                        };
                return req;
            };
            database.signup=function($username,$password,$email,$phoneno){
               var datavalue={
                                "username":$username,
                                "password":$password,
                                "phno":$phoneno,
                                "usermail":$email
                               };
               var req={
                            method : 'POST',
                            url : database.signupURL,
                            headers : header,
                            data : datavalue
                        };        
               return req;
            };
            
            database.viewcontacts=function($usermail){
                var datavalue={
                                "usermail" : $usermail
                            };
                var req={
                            method : "POST",
                            url : database.viewcontactsURL,
                            headers : header,
                            data : datavalue
                         };
                return req;         
            };
            database.uploadcontacts=function($usermail,$contactsobject){
                var datavalue={
                                    "usermail" : $usermail,
  	                                "contacts":$contactsobject
                                };
                var req={
                            method : "POST",
                            url: database.uploadcontactsURL,
                            headers: header,
                            data : datavalue
                        };
                return req;
            };
            database.deletecontacts=function($usermail,$contactsobject){
                var datavalue={
                                    "usermail" : $usermail,
  	                                "contacts":$contactsobject
                                };
                var req={
                            method : "POST",
                            url: database.deletecontactsURL,
                            headers: header,
                            data : datavalue
                        };
                return req;
            };
            database.logout=function($email){
                 var datavalue={
                                "usermail":$email
                               };
               var req={
                            method : 'POST',
                            url : database.logoutURL,
                            headers : header,
                            data : datavalue
                        };
                        alert(JSON.stringify(req));         
               return req;
            };
        return database;    
    });