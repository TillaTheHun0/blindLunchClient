angular.module('app.services', [])

/**
 * firebaseAuth object to use for authenticating
 */
.factory('firebaseAuth', ['rootRef', '$firebaseAuth', function(rootRef, $firebaseAuth) {
    return $firebaseAuth(rootRef);
}])

/**
 * firebaseObject ref to root of firebase. Not sure what we will use it for yet
 */
.factory('firebaseRef', ['rootRef', '$firebaseObject', function(rootRef, $firebaseObject){
    return $firebaseObject(rootRef);
}])

/**
 * Returns a firebaseObject referencing the passed in firebase path
 */
.factory('firebaseObject', function(firebaseAuth, $firebaseObject, rootRef){
    function transform(firebaseRef){
       return $firebaseObject(firebaseRef); 
    }
    return transform; 
})

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


