'user strict'

angular.module('blind-lunch')
    .controller('profileCtrl', function($scope, firebaseAuth, $state, rootRef, $rootScope, Spinner, firebaseObject, $timeout) {
        var authObject = firebaseAuth.$getAuth();
        var userNodeRef = rootRef.child('users').child(authObject.uid);
        var userNode = firebaseObject(userNodeRef);
        
        //userNode.$bindTo($scope, 'user');
        $scope.user = userNode;
        
        $scope.signOut = function(){
            firebaseAuth.$unauth();
            $state.go('login');
        } 
        $scope.saveInfo = function(){          
            Spinner.show(function(){
                $timeout(function(){ //timeout to simulate latency
                    $scope.user.$save();
                    Spinner.hide()  
                }, 2000);          
            }); 
        }
    })