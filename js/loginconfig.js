var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    onDeviceReady: function() {
       if(window.MobileAccessibility){
            window.MobileAccessibility.usePreferredTextZoom(false);
       }
       angular.bootstrap(document,['Contacts_sync']);   
    },
    onBackKeyDown: function(e) {
          e.preventDefault();
    }
};

app.initialize();