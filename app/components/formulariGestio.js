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
 
           var resetForm = function () {
                $scope.novaGestio.alumneid = "";
                $scope.novaGestio.professorid = "";
                $scope.novaGestio.assignaturaid = "";
                $scope.novaGestio.$setPristine();
                $scope.novaGestio.alumneid.$untouched = true;
                $scope.novaGestio.alumneid.$touched = false;
                $scope.novaGestio.professorid.$untouched = true;
                $scope.novaGestio.professorid.$touched = false;
                $scope.novaGestio.assignaturaid.$untouched = true;
                $scope.novaGestio.assignaturaid.$touched = false;
            };  
    },
    bindings: {
        loading: '<'
    }
    
    
});
