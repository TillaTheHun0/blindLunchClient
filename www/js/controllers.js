angular.module('app.controllers', [])

.controller('loginCtrl', ['firebaseAuth', '$rootScope', '$scope', '$state', 'rootRef', function(firebaseAuth, $rootScope, $scope, $state, rootRef) {
    /**
     * Listen for changes in authentication state
     */
    firebaseAuth.$onAuth(function(authData){
        //someone is logged in
        if(authData){
            $rootScope.uid = authData.uid;
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
}])
  
.controller('homeCtrl', function($scope, $ionicLoading) {
    $scope.init = function () {
        var myLatlng = new google.maps.LatLng('32.785908', '-79.936322');
        
        var mapOptions = {
            center: myLatlng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Chahston'
        });
        
        $scope.map = map;
    }
    
    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    }
})
   
.controller('profileCtrl',function($scope, firebaseAuth, $state, rootRef, $rootScope, $ionicLoading, Spinner) {
	   $scope.signOut = function(){
           firebaseAuth.$unauth();
           $state.go('login');
       } 
       $scope.saveInfo = function(firstName, lastName, description){          
           Spinner.show(function(){
               rootRef.child("users").child($rootScope.uid).update(
                {   
                    firstName:firstName,
                    lastName:lastName,
                    description:description
                },
                Spinner.hide()           
            );
           }); 
       }
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
 