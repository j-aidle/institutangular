angular.module('header')
    .controller('headerController', function headerController($scope, $mdSidenav, $state) {
        $scope.currentNavItem = 'landing-page.home';

        $scope.selectedItem = $state.current.name;

        $scope.$watch(function () {
            return $state.current.name;
        }, function (newValue, oldValue) {
            $scope.selectedItem = newValue;
        });

        $scope.toggleMenu = buildToggler('left');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }


    });