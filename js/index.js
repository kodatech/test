document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("933b8ea9-4bd9-4acf-84e1-7d7fcdb4c784", "AIzaSyAbcrB5sbEgQsOUx3jCG9HXNlNXPqdHTis")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
  
  // Sync hashed email if you have a login system or collect it.
  //   Will be used to reach the user at the most optimal time of day.
  // window.plugins.OneSignal.syncHashedEmail(userEmail);
}, false);