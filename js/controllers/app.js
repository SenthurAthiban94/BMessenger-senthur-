var chatApp=angular.module('ChattingApp', ['pubnub.angular.service','ui.bootstrap']);
    
chatApp.controller('ChatApp_Controller', ['$scope', 'Pubnub','$modal', '$log', function($scope, Pubnub,$modal,$log) {
        //////////////////////////  Modal Window    ////////////////////////////////
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
                   $scope.uuid=username;
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
                $("#msg").focus();
              };
            };
        //////////////////////////  Modal Window    ////////////////////////////////
                $scope.focus = function () {    
                    $("#msg").focus();
                  }
            $scope.messages = [];
            $scope.channel = 'messages-channel';

            $scope.messageContent = '';
            // Generating a random uuid between 1 and 100 using utility function from lodash library.

            // Please signup to PubNub to use your own keys: https://admin.pubnub.com/
            Pubnub.init({
                publish_key: 'pub-c-ac47d3c9-a960-4067-ad13-a5dd08d165c3',
                subscribe_key: 'sub-c-2a57f124-24e8-11e6-9a17-0619f8945a4f',
                ssl: true,
                uuid: $scope.uuid
            });

            // Send the messages over PubNub Network
            $scope.sendMessage = function() {
               // Don't send an empty message 
               if (!$scope.messageContent ||
                    $scope.messageContent === '') {
                    return;
                }
                Pubnub.publish({
                    channel: $scope.channel,
                    message: {
                        content: $scope.messageContent,
                        sender_uuid: $scope.uuid,
                        date: new Date()
                    },
                    callback: function(m) {
                        console.log(m);
                    }
                });
                // Reset the messageContent input
                $scope.messageContent = '';

            }

            // Subscribe to messages channel
            Pubnub.subscribe({
                channel: $scope.channel,
                triggerEvents: ['callback']
            });
            // Listenning to messages sent.
            $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function(ngEvent, m) {
                $scope.$apply(function() {
                    $scope.messages.push(m);
                });
                // Scrolling to the bottom of the message.
                $(".content").animate({ scrollTop: $('.content').prop("scrollHeight")}, 1000);
            });
            //fetching random pic
            $scope.avatarUrl = function(uuid){
                return 'http://robohash.org/'+uuid+'?set=set2&bgset=bg2&size=40x40';
            };
            $scope.differentiatemessage=function(username){
                    if($scope.uuid==username)
                    {
                        return ("sender_message");
                    }
                    else
                    {
                        return("reciever_message");
                    }
                };
}]);
