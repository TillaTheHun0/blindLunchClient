angular.module('app.services', [])

.factory('firebaseAuth', ['rootRef', '$firebaseAuth', function(rootRef, $firebaseAuth) {
    return $firebaseAuth(rootRef);
}])

.factory('firebaseRef', ['rootRef', '$firebaseObject', function(rootRef, $firebaseObject){
    return $firebaseObject(rootRef);
}])


