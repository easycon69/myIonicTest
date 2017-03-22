angular.module('myLab.controllers', [])

.factory('sessionRecoverer', function($q, $injector, User) {
  console.debug("sessionRecoverer : enter");
  return {
    responseError: function(response) {
      console.debug("sessionRecoverer response.status=" + response.status);
      if (response.status == 401)
      {
        User.register().then(function(response){
          console.debug(response);
        });

        //var $http = $injector.get("$http");
        //var deferred = $q.defer();

        //return $http(response.config);
      }
      return $q.reject(response);
    }
  }
})

.factory('Remote', function($http, Global, $ionicLoading) {
  return {
    getHome: function() {
      var myUrl = "/carrefourlife/api/home";
      return $http.get(myUrl).then(function(response){
        return response.data;
      }, function(error){
        return null;
      });
    }
  }
})

.factory('User', function($injector) {
  return {
    register: function() {
      var dataToSend = {Udid: "myUdid"};
      var myUrl = "/carrefourlife/register";
      var $http = $injector.get('$http');
      return $http({
        method: 'POST',
        url: myUrl,
        data: dataToSend,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(response){
        return response.data;
      }, function(error){
        return null;
      });
    }
  }
})

.factory('Global', function($http, $ionicPopup) {

  return {
    globalPopup: function(myTitle, myMessage) {
      var alertPopup = $ionicPopup.alert({
        title: myTitle,
        template: myMessage
      });
      return alertPopup;
    },
    generateUUID: function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
    }
  }
})

.factory('spAuthService', function ($http, $q) {
  var authenticate = function (userId, password, url) {
    var signInurl = url + '?wa=wsignin1.0'; //'https://' + url + '/_forms/default.aspx?wa=wsignin1.0';
    var deferred = $q.defer();
    var message = getSAMLRequest(userId, password, signInurl);

    $http({
      method: 'POST',
      url: 'https://login.microsoftonline.com/extSTS.srf',
      data: message,
      headers: {
          'Content-Type': "text/xml; charset=\"utf-8\""
      }
    }).success(function (data) {
      getBearerToken(data, signInurl).then(function (data) {
          deferred.resolve(data);
      }, function (data) {
          deferred.reject(data)
      })
    });

    return deferred.promise;
  };

  return {
    authenticate: authenticate
  };

  function getSAMLRequest(userID, password, url) {
    return '<s:Envelope \
                  xmlns:s="http://www.w3.org/2003/05/soap-envelope" \
                  xmlns:a="http://www.w3.org/2005/08/addressing" \
                  xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> \
                  <s:Header> \
                      <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action> \
                      <a:ReplyTo> \
                          <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address> \
                      </a:ReplyTo> \
                      <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To> \
                      <o:Security \
                          s:mustUnderstand="1" \
                          xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \
                          <o:UsernameToken> \
                              <o:Username>' + userID + '</o:Username> \
                              <o:Password>' + password + '</o:Password> \
                          </o:UsernameToken> \
                      </o:Security> \
                  </s:Header> \
                  <s:Body> \
                      <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"> \
                          <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"> \
                              <a:EndpointReference> \
                                  <a:Address>' + url + '</a:Address> \
                              </a:EndpointReference> \
                          </wsp:AppliesTo> \
                          <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType> \
                          <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType> \
                          <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType> \
                      </t:RequestSecurityToken> \
                  </s:Body> \
              </s:Envelope> \
              ';
  }

  function getBearerToken(result, url) {
    var deferred = $q.defer();
    var securityToken = $($.parseXML(result)).find("BinarySecurityToken").text();

    if (securityToken.length == 0) {
      deferred.reject();
    }
    else {
      $http({
          method: 'POST',
          url: url,
          data: securityToken,
          headers: {
              Accept: "application/json;odata=verbose"
          }
      }).success(function (data) {
          deferred.resolve(data);
      }).error(function () {
          deferred.reject();
      });
    }
    return deferred.promise;
  }

})

.config(function($httpProvider) {
  //$httpProvider.interceptors.push('sessionRecoverer');
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Remote) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  //Remote.getHome();

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ttsCtrl', function($scope) {
  $scope.data = {
    speechText: ''
  };
  $scope.recognizedText = '';

  $scope.speakText = function() {
    TTS.speak({
       text: $scope.data.speechText,
       locale: 'it-IT',
       rate: 1.5
    }, function () {
         // Do Something after success
    }, function (reason) {
         // Handle the error case
    });
  };

/*  $scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
            $scope.$apply()
        }
    };
    recognition.start();
  }; */
})

.controller('deviceCtrl', function($scope, $cordovaDevice) {
  $scope.device = {
    device: '',
    cordova: '',
    model: '',
    platform: '',
    uuid: '',
    version: ''
  };

  if (window.cordova) {
    $scope.device.device = $cordovaDevice.getDevice();
    $scope.device.cordova = $cordovaDevice.getCordova();
    $scope.device.model = $cordovaDevice.getModel();
    $scope.device.platform = $cordovaDevice.getPlatform();
    $scope.device.uuid = $cordovaDevice.getUUID();
    $scope.device.version = $cordovaDevice.getVersion();
  }

})

.controller('SignatureCtrl', function($scope, $stateParams) {
  var canvas = document.getElementById('signature_canvas');
  var signaturePad = new SignaturePad(canvas);
  // clear Canvas
  $scope.clearCanvas = function () {
    signaturePad.clear();
    $scope.saveCanvas();
  }
  // save Canvas
  $scope.saveCanvas = function () {
    var sigImg = signaturePad.toDataURL();
    $scope.signature = sigImg;
  }
})

.controller('SharepointCtrl', function($scope, $stateParams, spAuthService, $state) {
  $scope.htmlPage = '';

  $scope.sharepointLogin = function() {
    var user = "GradyA@MOD945128.onmicrosoft.com";
    var password = "pass@word1";
    var url = "https://mod945128.sharepoint.com/sites/deejsdemo/Pages/Home.aspx";
    var myTest = "https://mod945128.sharepoint.com/_forms/default.aspx?wa=wsignin1.0"
    spAuthService.authenticate(user, password, url).then(function(response){
      console.log("spAuthService", response);
      $scope.htmlPage = '<h1>Test</h1>'; //response;
    })
  }

  $scope.gotoDetail = function() {
    $state.go('app.sharepointdetail');
  }
})

.controller('SharepointdetailCtrl', function($scope, $stateParams, spAuthService, $sce) {
  $scope.baseUrl = 'https://mod945128.sharepoint.com/sites/deejsdemo/Pages/Home.aspx';

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
})

.controller('InappbrowserCtrl', function($scope, $stateParams, $cordovaInAppBrowser) {
  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'yes'
  };
  $cordovaInAppBrowser.open('https://mod945128.sharepoint.com/sites/deejsdemo/Pages/Home.aspx', '_blank', defaultOptions);
})

.controller('FocusCtrl', function($scope, $stateParams) {
  $scope.data = {
    text1: '',
    text2: 0
  }

  $scope.sayAlert = function(){
    //setTimeout(function () {
      angular.element(document.getElementById("txt2")).focus();
      angular.element(document.getElementById("txt2")).select();
    //}, 0);

    //alert("ciao");
  }
})

.controller('CsvCtrl', function($scope, $stateParams) {
  $scope.data = {
    text1: '',
    text2: 0
  }

  $scope.loadCsv = function(){
    Papa.parse("http://icleanrg.000webhostapp.com/ALBERGO.js", {
      download: true,
      complete: function(results) {
        for(i=0;i<results.data.length;i++){
          console.log(i, results.data[i]);
        }
        console.log(results);

      }
    });
/*
    Papa.parse("http://mycarrefour-dev.azurewebsites.net/assets/albergo.csv", {
      download: true,
      step: function(row) {
        console.log("Row:", row.data);
      },
      complete: function() {
        console.log("All done!");
      }
    });*/
//    alert("CSV");
  }
})

.controller('SignalrCtrl', function($scope, $stateParams) {

  $scope.data = {
    user: 'pippo',
    message: '',
    queue: []
  }

  $.connection.hub.url = 'http://localhost:62812/signalr';
  $scope.chat = $.connection.myTest;
   
  // register a client method on hub to be invoked by the server
  $scope.chat.client.broadcastMessage = function (name, message) {
      var newMessage = name + ' says: ' + message;

      // push the newly coming message to the collection of messages
      $scope.data.queue.push(newMessage);
      $scope.$apply();
  };




  //var connection = $.hubConnection();
  //$scope.proxy = connection.createHubProxy('myTest');
  //var aaa = 1;

  //$scope.proxy.on('receiveMessage', function (chat) {
    //$rootScope.$emit("messageReceived", chat);
  //  var bbb = 2;
  //});

  $scope.connectToServer = function() {

    $.connection.hub.start().done(function(response){
      console.log('Now connected, connection ID=' + response.id);
    }).fail(function(error){
      console.log('Could not connect');
    });
  };

  $scope.sendMessage = function(){
    $scope.chat.server.send($scope.data.user, $scope.data.message);
  }
});
