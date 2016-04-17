'user strict'

angular.module('blind-lunch')
    .controller('signupCtrl', function($scope, firebaseAuth, rootRef, $state) {
        /**
         * Create Account with username password
         */
        $scope.createAccount = function(name, username, password){
            firebaseAuth.$createUser({
                email: username,
                password: password
            }).then(function(authData){
                //create users node
                console.log(authData);
                rootRef.child('users').child(authData.uid).set({
                    username: parseEmail(username),
                    name: name,
                    provider: 'local'
                }, function(error){
                if(error){
                    $scope.error = error;  
                } else {
                    $state.go('login');
                }
                })
            }).catch(function(error){
                //error creating user show error to user
                $scope.error = error;
            });
        }
        
        function parseEmail(email){
            return email.replace(/\./, ',');
        };
    })