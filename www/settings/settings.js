'user strict'

angular.module('blind-lunch')
    .config(function($stateProvider){
        $stateProvider
        .state('blindLunch', {
            url: '/side-menu',
            templateUrl: 'settings/settings.html',
            abstract:true,
            controller:'settingsCtrl'
        })
    })