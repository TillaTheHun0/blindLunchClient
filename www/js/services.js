angular.module('app.services', [])

.factory('firebaseAuth', ['rootRef', '$firebaseAuth', function(rootRef, $firebaseAuth) {
    return $firebaseAuth(rootRef);
}])

.factory('firebaseRef', ['rootRef', '$firebaseObject', function(rootRef, $firebaseObject){
    return $firebaseObject(rootRef);
}])

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


