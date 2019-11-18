angular.module('assignatura')
    .controller('assignaturaController',
    ['$scope', 'assignatures',
        function assignaturaController($scope, assignatures) {
            $scope.loading = false;

            var resetformAssignatures = function () {
                $scope.novaAssignaturaForm.$setPristine();
                $scope.novaAssignaturaForm.nom.$touched = false;
                $scope.novaAssignaturaForm.nom.$untouched = true;
            };

            assignatures.get().then((response) => {
                console.log(response);
                $scope.assignatures = response.data;
            }, (error) => {
                console.log(error);
                }
            );

            $scope.postassignatura = (isValid) => {
                if (isValid) {
                    $scope.loading = true;
                    var data = {
                        nom: $scope.assignatures.nom
                    };
                    var config = {
                        headers: { 'Content-Type': 'application/json' }
                    };
                    assignatures.post(data, config).then(() => {
                        $scope.msg = "creat";
                        assignatures.get().then((response) => {
                            console.log(response);
                            $scope.assignatures = response.data;
                        }, (error) => {
                            console.log(error);
                        }
                        );
                        resetformAssignatures();
                        $scope.loading = false;
                    }, (error) => { console.log(error);});

                }
            };

        }]);