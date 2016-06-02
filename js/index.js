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
        document.addEventListener('load', this.onDeviceload, false);
        document.addEventListener('offline', this.onDeviceoffline, false);
        document.addEventListener('online', this.onDeviceonline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceload: function(){
        
    },
    onDeviceoffline: function(){
        
    },
    onDeviceonline: function(){
        
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
         for(var i=1, len=c.length; i<=len; i++) {
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                tablebody.innerHTML += "<tr><td class=\"col-sm-1 col-xs-1 col-md-1\">"+i+"</td><td class=\"col-sm-9 col-xs-9 col-md-9\" style=\"font-size:18px;\"><div><div><b><span>Name</span>: </b><span style=\"padding-left:2px;\">"+c[i].displayName+"</span></div></div><div><div><b><span>Number</span>: </b><span style=\"padding-left:2px;\">"+c[i].phoneNumbers[0].value+"</span></div></div></td><td class=\"col-sm-2 col-xs-2 col-md-2\"style=\"padding-top:10px;padding-bottom:10px;\"><button type=\"button\" class=\"btn btn-warning\" style=\"height:35px;padding-top:2px;padding-bottom:2px;\">Upload</button></td></tr>";
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