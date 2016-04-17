'use strict'

angular.module('blind-lunch')
    .controller('loginCtrl', function(firebaseAuth, $rootScope, $scope, $state, rootRef) {
        /**
         * Listen for changes in authentication state
         */
        firebaseAuth.$onAuth(function(authData){
            //someone is logged in
            if(authData){
                $rootScope.uid = authData.uid;
                rootRef.child('users').child(authData.uid).once('value', function(snapshot){
                    //if user node doesn't exist ie. new user
                    if(!snapshot.val()){
                        //create new user node
                        rootRef.child('users').child(authData.uid).set({
                            provider: authData.provider,
                            name: getName(authData),
                            email: getEmail(authData)
                        })
                    }
                    //log and go to home screen
                    console.log("Already authenticated. Logged in as: " + authData.uid);
                    $state.go('blindLunch.home');
                }); 
            }
            else{
                console.log("logged out");
            }
        });
        
        function getName(authData){
            switch(authData.provider){
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'facebook':
                    return authData.facebook.displayName;
            };
        };
        
        function getEmail(authData){
        switch(authData.provider){
                case 'password':
                    return parseEmail(authData.password.email)
                case 'facebook':
                    return parseEmail(authData.facebook.email);
            }; 
        };
        
        function parseEmail(email){
            return email.replace(/\./, ',');
        };
        
        var permissions = {
            scope: 'email'
        };
        
        $scope.facebookLogin = function(){
            firebaseAuth.$authWithOAuthPopup('facebook', permissions)
            .then(function(authData) {
                console.log(authData);
                $rootScope.uid = authData.uid;
                $state.go('blindLunch.home');
            });
        };
        
        $scope.localLogin = function(username, password){
            console.log(username + ' ' + password);
            firebaseAuth.$authWithPassword({
                email: username,
                password: password
            }).then(function(authData){
                console.log('logged in as: ' + authData.uid);
                $rootScope.uid = authData.uid;
                $state.go('blindLunch.home');
            }).catch(function(error){
                console.error('Authentication failed ', error);
            })
        };
    })