'use strict';

angular.module('gestio')
    .component('formulariGestio', {
        templateUrl: './components/formulariGestio.template.html',
        controller: function formulariGestioController($scope) {

             $scope.postgestio = (isValid) => {
                var novaGestio = {
                    alumneid: undefined,
                    professorid: undefined,
                    assignaturaid: undefined
                };
                 if (isValid) {
                         novaGestio = {
                             alumneid: $scope.novaGestio.alumneid,
                             professorid: $scope.novaGestio.professorid,
                             assignaturaid: $scope.novaGestio.assignaturaid,
                         };
                         $scope.$emit('created', isValid, novaGestio);
                         resetForm();
                }
                
            };

            var resetForm = () => {
                $scope.novaGestio.alumneid = undefined;
                $scope.novaGestio.professorid = undefined;
                $scope.novaGestio.assignaturaid = undefined;
                $scope.novaGestioForm.$setPristine();
                $scope.novaGestioForm.$setUntouched();
                //$scope.novaGestioForm.alumneid.$untouched = true;
                //$scope.novaGestioForm.alumneid.$touched = false;
                //$scope.novaGestioForm.professorid.$untouched = true;
                //$scope.novaGestioForm.professorid.$touched = false;
                //$scope.novaGestioForm.assignaturaid.$untouched = true;
                //$scope.novaGestioForm.assignaturaid.$touched = false;
            };  
    },
    bindings: {
        loading: '<',
        error: '<',
        alumnes: '<',
        professors: '<',
        assignatures: '<'
    }
    
    
});
