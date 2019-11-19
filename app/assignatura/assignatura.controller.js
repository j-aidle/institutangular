angular.module('assignatura')
    .controller('assignaturaController',
    ['$scope', '$mdDialog', '$mdToast', 'assignatures',
        function assignaturaController($scope, $mdDialog, $mdToast, assignatures) {

            //this.orderProp = 'id';
            $scope.propertyName = 'nom';
            $scope.reverse = true;

            $scope.sortBy = function (propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
            };


            $scope.loading = false;
            $scope.loadingdelete = null;
            $scope.loadingupdate = null;

            $scope.editing = null;
            $scope.canviassignatura = {
                nom: ""
            };

            $scope.unselect = () => {
                $scope.editing = null;
            };

            $scope.initupdateassignatura = (assignatura, param) => {
                $scope.editing = assignatura.id + param;
                $scope.canviassignatura.id = assignatura.id;
                $scope.canviassignatura.nom = assignatura.nom;
            };


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

            var destroyassignatura = (assignatura) => {
                $scope.loadingdelete = assignatura.id;
                assignatures.delete(assignatura.id).then(() => {
                    assignatures.get().then((response) => {
                        console.log(response);
                        $scope.assignatures = response.data;
                    }, (error) => {
                        console.log(error);
                    });
                        $scope.loadingdelete = null;
                }, (error) => { console.log(error); });
            };


            $scope.confirmDelete = (ev, assignatura) => {
                var confirm = $mdDialog.confirm()
                    .title('Estas segur que vols esborrar-lo? ID Assignatura: ' + assignatura.id)
                    .textContent('L assignatura que has seleccionat serà esborrada permanentment.')
                    .ariaLabel('Esborrar assignatura')
                    .targetEvent(ev)
                    .ok('Si')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    destroyassignatura(assignatura);
                });
            };

            $scope.updateassignatura = (assignatura) => {
                $scope.loadingupdate = assignatura.id;
                assignatures.update(assignatura.id, $scope.canviassignatura).then(
                    (response) => {
                        console.log(response);
                        assignatures.get().then((response) => {
                            console.log(response);
                            $scope.assignatures = response.data;
                        }, (error) => {
                            console.log(error);
                            });
                        $scope.loadingupdate = null;
                        $scope.editing = null;
                    }, (error) => {
                        console.log(error);
                    });
            };







        }]);