angular.module('app.controllers', [])

.controller('loginCtrl', ['Auth', '$scope', '$state', function(Auth, $scope, $state) {
    $scope.facebookLogin = function(){
        Auth.$authWithOAuthPopup('facebook')
        .then(function(authData) {
            console.log(authData);
            $state.go('blindLunch.home');
        });
    };
}])
  
.controller('homeCtrl', function($scope) {

})
   
.controller('profileCtrl', function($scope) {

})
      
.controller('signupCtrl', function($scope) {

})
 