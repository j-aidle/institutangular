angular.module('professor')
    .controller('professorController', ['$scope','professors', function professorController($scope,professors) {

        professors.get().then((response) => {
            $scope.professors = response.data;
            console.log(response.data);
        }, (error) => {
            console.log(error);
        });


    }]);