angular.module('app.controllers', [])

.controller('loginCtrl', ['firebaseAuth', '$scope', '$state', 'rootRef', function(firebaseAuth, $scope, $state, rootRef) {
    /**
     * Listen for changes in authentication state
     */
    firebaseAuth.$onAuth(function(authData){
        //someone is logged in
        if(authData){
            rootRef.child('users').child(authData.uid).on('value', function(snapshot){
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
            $state.go('blindLunch.home');
        });
    };
    
    $scope.localLogin = function(email, password){
        firebaseAuth.$authWithPassword({
            email: parseEmail(email),
            password: password
        }).then(function(authData){
            console.log('logged in as: ' + authData.uid);
            $state.go('blindLunch.home');
        }).catch(function(error){
            console.error('Authentication failed');
        })
    };
}])
  
.controller('homeCtrl', function($scope) {

})
   
.controller('profileCtrl', function($scope) {

})
      
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
 