'user strict'

angular.module('blind-lunch')
    .controller('settingsCtrl', function($scope, rootRef) {
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
    })