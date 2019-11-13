angular.module('header')
    .controller('headerController', function headerController($scope, $mdSidenav, $state) {

        $scope.selectedItem = $state.current.name;

        $scope.toggleMenu = buildToggler('left');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }


    });