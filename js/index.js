/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var names=[];
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       navigator.contacts.find([navigator.contacts.fieldType.displayName],app.gotContacts,app.errorHandler);   
    },
    // Update DOM on a Received Event
    gotContacts: function(c) {
        console.log("gotContacts, number of results "+c.length);
         var tablebody = document.querySelector("#result");
         
         /* Retriving phoneNumbers */
         for(var i=0, len=c.length; i<len; i++) {
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                tablebody.innerHTML += "<tr><td>"+(i+1)+"</td><td><div><div><b><span>Name</span>: </b><span style=\"padding-left:2px;\">"+c[i].displayName+"</span></div></div><div><div><b><span>Number</span>: </b><span style=\"padding-left:2px;\">"+c[i].phoneNumbers[0].value+"</span></div></div></td><td></td></tr>";
             }
         }
        
//         /* Retriving Email */
//         for(var i=0, len=c.length; i<len; i++) {
//             if(c[i].emails && c[i].emails.length > 0) {
//                emailDiv.innerHTML += "<p>"+c[i].emails[0].value+"</p>";
//             }
//         }
    },
    errorHandler: function(e){
        console.log("errorHandler: "+e);
    }
};

app.initialize();