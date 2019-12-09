angular.module('assignatura')
    .controller('assignaturaController',
    ['$scope', '$mdDialog', '$mdToast', 'assignatures',
        function assignaturaController($scope, $mdDialog, $mdToast, assignatures) {

            //this.orderProp = 'id';
            $scope.propertyName = 'nom';
            $scope.reverse = false;

            $scope.sortBy = function (propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
                $scope.propertyName = propertyName;
            };


            $scope.loading = false;
            $scope.loadingdelete = null;
            $scope.loadingupdate = null;
            $scope.loadingTable = true;
            let updateValid = null;

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
                updateValid = assignatura.id;
            };


            var resetformAssignatures = function () {
                $scope.novaAssignaturaForm.$setPristine();
                $scope.novaAssignaturaForm.nom.$untouched = true;
                $scope.novaAssignaturaForm.nom.$touched = false;
            };

            assignatures.get().then((response) => {
                console.log(response);
                $scope.assignatures = response.data;
                $scope.loadingTable = false;
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
                        ToastCreate();
                        resetformAssignatures();
                        $scope.loading = false;
                        //$mdDialog.hide();                        
                    }, (error) => { console.log(error);});

                }
            };

            var destroyassignatura = (assignatura) => {
                $scope.loadingdelete = assignatura.id;
                assignatures.delete(assignatura.id, $scope.canviassignatura).then(() => {
                    assignatures.get().then((response) => {
                        console.log(response);
                        $scope.assignatures = response.data;
                        ToastDelete();
                    }, (error) => {
                        console.log(error);
                    });
                        $scope.loadingdelete = null;
                }, (error) => { console.log(error); });
            };


            $scope.confirmDelete = (ev, assignatura) => {
                var confirm = $mdDialog.confirm()
                    .title('Estas segur que vols esborrar-lo? ID Assignatura: ' + assignatura.id)
                    .textContent('L\'assignatura que has seleccionat serà esborrada permanentment.')
                    .ariaLabel('Esborrar assignatura')
                    .targetEvent(ev)
                    .ok('Si')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    destroyassignatura(assignatura);
                });
            };

            $scope.updateassignatura = (assignatura) => {
                if (updateValid == assignatura.id) {
                    $scope.loadingupdate = assignatura.id;
                    assignatures.update(assignatura.id, $scope.canviassignatura).then(
                        (response) => {
                            console.log(response);
                            assignatures.get().then((response) => {
                                $scope.assignatures = response.data;
                                $scope.loadingupdate = null;
                                $scope.editing = null;
                                ToastUpdate();
                            }, (error) => {
                                console.log(error);
                            });
                        }, (error) => {
                            console.log(error);
                            $scope.loadingupdate = null;
                        });
                } else {
                    console.log("no has editat l assignatura");
                }
            };

            //$scope.formUpdate = (event) => {
            //    $mdDialog.show({
            //        clickOutsideToClose: true,
            //        templateUrl: './assignatura/formassignatura.html',
            //        targetEvent: event,
            //        controller: assignaturaController
            //    });
                
            //};



            // TOAST

            var last = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };

            var toastPosition = angular.extend({}, last);

            var getToastPosition = () => {
                sanitizePosition();

                return Object.keys(toastPosition)
                    .filter(function (pos) {
                        return toastPosition[pos];
                    }).join(' ');
            };

            var sanitizePosition = () => {
                var current = toastPosition;

                if (current.bottom && last.top) {
                    current.top = false;
                }
                if (current.top && last.bottom) {
                    current.bottom = false;
                }
                if (current.right && last.left) {
                    current.left = false;
                }
                if (current.left && last.right) {
                    current.right = false;
                }

                last = angular.extend({}, current);
            }

            var ToastCreate = function () {
                var pinTo = getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('S\'ha creat l\'assignatura!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };

            var ToastDelete = function () {
                var pinTo = getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('S\'ha esborrat l\'assignatura!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };

            var ToastUpdate = function () {
                var pinTo = getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('S\'ha actualitzat l\'assignatura!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };

                             

            //$scope.gridOptions = {

            //    bindingOptions: {
            //        dataSource: 'assignatures',
            //        },
            //    allowColumnReordering: true,
            //    allowColumnResizing: true,
            //    columnAutoWidth: true,
            //    showBorders: true,
            //    remoteOperations: true,
            //    editing: {
            //        mode: "popup",
            //        allowAdding: true,
            //        allowUpdating: true,
            //        allowDeleting: true,
            //        popup: {
            //            title: "Assignatures",
            //            showTitle: true,
            //            width: 500,
            //            height: 250,
            //            position: {
            //                my: "top",
            //                at: "top",
            //                of: window
            //            }
            //        }
            //    },
            //    columnFixing: {
            //        enabled: true
            //    },
            //    columns: [{
            //        caption: "id",
            //        dataField: "id",
            //    }, {
            //        caption: "nom",
            //        dataField: "nom",
            //        }],
            //    summary: {
            //        totalItems: [{
            //            column: "nom",
            //            summaryType: "count"
            //        }]
            //    }

            //}

                               

        }]);