'user strict'

angular.module('blind-lunch')
    .config(function($stateProvider){
        $stateProvider
        .state('blindLunch.home', {
            url: '/home',
            views: {
                'side-menu': {
                    templateUrl: 'home//home.html',
                    controller: 'homeCtrl'
                }
            }
        });
    });