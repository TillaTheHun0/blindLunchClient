angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('blindLunch.home', {
    url: '/home',
    views: {
      'side-menu': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('blindLunch.profile', {
    url: '/profile',
    views: {
      'side-menu': {
          templateUrl: 'templates/profile.html',
          controller: 'profileCtrl' 
      }
    }
  })

  .state('blindLunch', {
    url: '/side-menu',
    templateUrl: 'templates/settings.html',
    abstract:true,
    controller:'settingsCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});