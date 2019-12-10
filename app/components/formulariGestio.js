'use strict';

angular.module('gestio')
    .component('formulariGestio', {
        templateUrl: './components/formulariGestio.template.html',
        controller: function formulariGestioController($scope) {

             $scope.postgestio = (isValid) => {
                var novaGestio = {
                    alumneid: "",
                    professorid: "",
                    assignaturaid: ""
                };
                if (isValid) {
                    novaGestio = {
                        alumneid: $scope.novaGestio.alumneid,
                        professorid: $scope.novaGestio.professorid,
                        assignaturaid: $scope.novaGestio.assignaturaid,
                    };
                    $scope.$emit('created',isValid,novaGestio);
                    resetForm();
                }
                
            };
             
           var resetForm = ()=> {
                $scope.novaGestio.alumneid = "";
                $scope.novaGestio.professorid = "";
                $scope.novaGestio.assignaturaid = "";
                $scope.novaGestioForm.$setPristine();
                $scope.novaGestioForm.alumneid.$untouched = true;
                $scope.novaGestioForm.alumneid.$touched = false;
                $scope.novaGestioForm.professorid.$untouched = true;
                $scope.novaGestioForm.professorid.$touched = false;
                $scope.novaGestioForm.assignaturaid.$untouched = true;
                $scope.novaGestioForm.assignaturaid.$touched = false;
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
