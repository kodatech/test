var app;

app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        alert("bindEvents")
        //alert("hi")
        // Add to index.js or the first page that loads with your app.
        // For Intel XDK and please add this to your app.js.

        //document.addEventListener('deviceready', this.onDeviceReady, false);

        document.addEventListener('deviceready', function () {
          alert("deviceready")

          // Enable to debug issues.
          // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
          
          var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          };

          window.plugins.OneSignal
            .startInit("933b8ea9-4bd9-4acf-84e1-7d7fcdb4c784", "144953997036")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
          
          // Sync hashed email if you have a login system or collect it.
          //   Will be used to reach the user at the most optimal time of day.
          // window.plugins.OneSignal.syncHashedEmail(userEmail);
        }, false);
       
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        
        //iniEvents();


    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    }


};