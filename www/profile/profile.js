'user strict'

angular.module('blind-lunch')
    .config(function($stateProvider){
        $stateProvider
        .state('blindLunch.profile', {
            url: '/profile',
            views: {
                'side-menu': {
                    templateUrl: 'profile/profile.html',
                    controller: 'profileCtrl' 
                }
            }
        })
    })