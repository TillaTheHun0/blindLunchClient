angular.module('app.controllers', [])
  
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
   
.controller('profileCtrl', function($scope) {

})
      
.controller('signupCtrl', function($scope) {

})
   
.controller('loginCtrl', function($scope) {

})
 