/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var chatt=angular.module('chatting',['chat','ui.bootstrap']).constant('config',{
    "pubnub":{
        "publish-key":"pub-c-70eb5318-259b-4ac5-93fb-a33c8fb30f36",
        "subscribe-key":"sub-c-ff8396c4-20e6-11e6-9327-02ee2ddab7fe"
    }
});
chatt.directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
});
chatt.controller( 'chatting_controller', [ 'Messages', '$scope','$modal', '$log',
function( Messages, $scope,$modal,$log ) {
    // Message Inbox
    $scope.messages = [];
    $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      backdrop: 'static',
      keyboard: false,
      size: size,
      resolve: {
        username: function () {
          return $scope.username;
        }
     
      }
    });
    modalInstance.result.then(function (username) {
       Messages.user({ name : username });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  
  
  
var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.user = {
    name: ''
  };

  $scope.ok = function () {
    $modalInstance.close($scope.user.name);
  };
};

    $scope.focus = function () {
        $("#msg").focus();
      }
    // Receive Messages
    Messages.receive(function(message){
        $scope.messages.push(message);
    });

    // Send Messages
    $scope.send = function() {
        Messages.send({ data : $scope.textbox });
    };
} ] );