'user strict'

angular.module('blind-lunch')
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