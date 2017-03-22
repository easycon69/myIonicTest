// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myLab', ['ionic', 'myLab.controllers', 'ngCordova', 'ngSanitize'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.tts', {
    url: '/tts',
    views: {
      'menuContent': {
        templateUrl: 'templates/tts.html',
        controller: 'ttsCtrl'
      }
    }
  })

  .state('app.device', {
    url: '/device',
    views: {
      'menuContent': {
        templateUrl: 'templates/device.html',
        controller: 'deviceCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })

  .state('app.signature', {
    url: '/signature',
    views: {
      'menuContent': {
        templateUrl: 'templates/signature.html',
        controller: 'SignatureCtrl'
      }
    }
  })

  .state('app.sharepoint', {
    url: '/sharepoint',
    views: {
      'menuContent': {
        templateUrl: 'templates/sharepoint.html',
        controller: 'SharepointCtrl'
      }
    }
  })

  .state('app.sharepointdetail', {
    url: '/sharepointdetail',
    views: {
      'menuContent': {
        templateUrl: 'templates/sharepointdetail.html',
        controller: 'SharepointdetailCtrl'
      }
    }
  })

  .state('app.inappbrowser', {
    url: '/inappbrowser',
    views: {
      'menuContent': {
        templateUrl: 'templates/inappbrowser.html',
        controller: 'InappbrowserCtrl'
      }
    }
  })

  .state('app.focus', {
    url: '/focus',
    views: {
      'menuContent': {
        templateUrl: 'templates/focus.html',
        controller: 'FocusCtrl'
      }
    }
  })

  .state('app.csv', {
    url: '/csv',
    views: {
      'menuContent': {
        templateUrl: 'templates/csv.html',
        controller: 'CsvCtrl'
      }
    }
  })

  .state('app.signalr', {
    url: '/signalr',
    views: {
      'menuContent': {
        templateUrl: 'templates/signalr.html',
        controller: 'SignalrCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
