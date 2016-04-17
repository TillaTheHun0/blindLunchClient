'use strict'

angular.module('blind-lunch')
    .config(function($stateProvider){
        $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'account/signup/signup.html',
            controller: 'signupCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'account/login/login.html',
            controller: 'loginCtrl'
        })
    });