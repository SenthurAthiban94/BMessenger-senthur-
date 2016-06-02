var names=[];
var loading;
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
         if(c.length!=0)
         {
             $('#noresults').hide();
         }
         var tablebody = document.querySelector("#result");
         var count=0;
         /* Retriving phoneNumbers */
         for(var i=0, len=c.length; i<len; i++) {
             if(c[i].phoneNumbers && c[i].phoneNumbers.length > 0) {
                tablebody.innerHTML += "<tr><td class=\"col-sm-1 col-xs-1 col-md-1\">"+(count+1)+"</td><td class=\"col-sm-9 col-xs-9 col-md-9\" style=\"font-size:16px;\"><div><div><b><span>Name</span>: </b><span style=\"padding-left:2px;\">"+c[i].displayName+"</span></div></div><div><div><b><span>Number</span>: </b><span style=\"padding-left:2px;\">"+c[i].phoneNumbers[0].value+"</span></div></div></td><td class=\"col-sm-2 col-xs-2 col-md-2\"style=\"padding-top:10px;padding-bottom:10px;\"><button type=\"button\" class=\"btn btn-warning\" style=\"height:35px;padding-top:2px;padding-bottom:2px;\">Upload</button></td></tr>";
             }
         }
         $('#loaderbackground').hide();
        
    },
    errorHandler: function(e){
        console.log("errorHandler: "+e);
    }
};

app.initialize();