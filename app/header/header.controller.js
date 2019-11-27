angular.module('header')
    .controller('headerController', function headerController($scope, $mdSidenav, $state) {
        $scope.currentNavItem = 'landing-page.home';

        $scope.selectedItem = $state.current.name;

        $scope.$watch('selected', $scope.selectedItem  );


        $scope.toggleMenu = buildToggler('left');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }


    });