angular.module('gestio')
    .controller('gestioController', ['$scope', 'dades', function gestioController($scope, dades) {

        dades.get().then(
            (response) => { 
                $scope.dades = response.data; 
            }, (error) => {
                console.log(error);
            });



    }]);