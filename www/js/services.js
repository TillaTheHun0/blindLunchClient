angular.module('app.services', [])

.factory('Auth', ['rootRef', '$firebaseAuth', function(rootRef, $firebaseAuth) {
    return $firebaseAuth(rootRef);
}])



