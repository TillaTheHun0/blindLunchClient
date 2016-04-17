'use strict'

angular.module('blind-lunch')
    /**
     * Spinner that blocks user interaction and displays spinning icon.
     * Can be used when loading data.
     */
    .factory('Spinner', ['$ionicLoading', function($ionicLoading){
        return {
            show : function(execute){
                $ionicLoading.show({
                    template: '<ion-spinner icon="ripple"></ion-spinner>',
                    hideOnStateChange: true
                });
                execute();
            },
            hide : function(){
                $ionicLoading.hide();
            }
        }
    }])
