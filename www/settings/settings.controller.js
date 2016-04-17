'user strict'

angular.module('blind-lunch')
    .controller('settingsCtrl', function($scope, rootRef, $cordovaGeolocation, firebaseAuth, Spinner) {
        var auth = firebaseAuth.$getAuth();
        
        var geolocationOpt = {
            timeout: 3000,
            maximumAge: 5000,
            enableHighAccuracy: true
        };
        
        var addLunchToUserCallback = function(data){
            rootRef.child('users').child(auth.uid).child('lunches').push({
                ref: data.toString(),
                complete: false
            }, Spinner.hide()); 
        };
        
        var postLunch = function pushLunch(pos){
            var date = new Date().toString();
            console.log(date);
            rootRef.child('lunchQueue').push({
                   creator: auth.uid,
                   price: $scope.priceSlider.value,
                   range: $scope.radiusSlider.value,
                   time: date,
                   participants: {
                       min: $scope.participantSlider.min,
                       max: $scope.participantSlider.max
                   },
                   age: {
                       min: $scope.ageSlider.min,
                       max: $scope.ageSlider.max
                   },
                   centerLocation: {
                       lat: pos.coords.latitude,
                       long: pos.coords.longitude
                   }
                }).then(function(data){
                    addLunchToUserCallback(data);
                })
        };
        
        $scope.radiusSlider = { 
            value: 10,
            options: { 
                floor: 0, 
                ceil: 50, 
                step: 5 
            }
        };
                        
        $scope.priceSlider = { 
                value: 2,
                options: { 
                    floor: 1, 
                    ceil: 3, 
                    step: 1 
                }
            };
                            
        $scope.participantSlider = { 
            min: 1,
            max: 5,
            options: { 
                floor: 1, 
                ceil: 10, 
                step: 1,
                noSwitching: true
            }
        };
        
        $scope.ageSlider = { 
            min: 20,
            max: 30,
            options: { 
                floor: 16, 
                ceil: 40, 
                step: 1,
                noSwitching: true
            }
        };
        
        $scope.postLunch = function() {
            var isCordovaApp = (typeof window.cordova !== "undefined");
            //get location
            Spinner.show(function() {
               if(isCordovaApp){
                    console.log('cordova app');
                $cordovaGeolocation.getCurrentPosition(geolocationOpt)
                    .then(function(pos){
                        postLunch(pos);
                    }, function(error){
                        console.log(error);
                    }); 
                }
                else{
                    console.log('browser app')
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        postLunch(pos);
                    }, function (error) {
                        console.log(error)
                    });    
                } 
            });
        };
        
    })