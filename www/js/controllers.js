angular.module('app.controllers', [])

.controller('loginCtrl', ['firebaseAuth', '$rootScope', '$scope', '$state', 'rootRef', function(firebaseAuth, $rootScope, $scope, $state, rootRef) {
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
}])
  
.controller('homeCtrl', function($scope, $ionicLoading) {
    $scope.init = function () {
        var myLatLng = new google.maps.LatLng('32.785908', '-79.936322');
        
        var mapOptions = {
            center: myLatLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
            
        var request = {
          location: myLatLng,
          radius: '2000',
          types: ['bakery', 'bar', 'cafe', 'night_club', 'restaurant']
        };

        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        
        service.radarSearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];

                    var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        title: place.name,
                        animation: google.maps.Animation.DROP,
                        customInfo: {
                            place_id: place.place_id
                        },
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/micons/restaurant.png',
                            anchor: new google.maps.Point(10, 10),
                            scaledSize: new google.maps.Size(20, 20)
                        }
                    });
                    
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            service.getDetails({ placeId: marker.customInfo.place_id }, function (place, status) {
                                if (status == google.maps.places.PlacesServiceStatus.OK) {
                                    var html = '<div><strong>' + place.name + '</strong><br>' +
                                        'Place ID: ' + place.place_id + '<br>' +
                                        'Price Level: ' + place.price_level + '<br>' +
                                        '<a href="#" onClick="alert(\'lol jk! soon...\')">Create lunch!</a><br>' +
                                        place.formatted_address + '</div>';
                                    infowindow.setContent(html);
                                    infowindow.open(map, marker, html);
                                }
                            });
                        }
                    })(marker, i));
                }
            }
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
   
.controller('profileCtrl', function($scope, firebaseAuth, $state, rootRef, $rootScope, $ionicLoading, Spinner, firebaseObject, $timeout) {
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
 