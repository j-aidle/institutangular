angular.module('alumne')
    .controller('alumneController',
    ['$scope', '$mdDialog', '$mdToast', 'alumnes',
        function matriculaController($scope, $mdDialog, $mdToast, alumnes)
            {
                //this.orderProp = 'id';
                $scope.propertyName = 'edat';
                $scope.reverse = true;

                $scope.sortBy = function (propertyName) {
                    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                    $scope.propertyName = propertyName;
                };


                $scope.loading = false;
                $scope.loadingdelete = null;
                $scope.loadingupdate = null;
                $scope.loadingTable = true;
                let updateValid = null;

                $scope.editing = null;
                $scope.canviAlumne = {
                    nom: "",
                    cognom: "",
                    edat: ""
                };

                $scope.unselect = () => {
                    $scope.editing = null;
                };


                $scope.initupdatealum = (alumne, param) => {
                    $scope.editing = alumne.id + param;
                    $scope.canviAlumne.id = alumne.id;
                    $scope.canviAlumne.nom = alumne.nom;
                    $scope.canviAlumne.cognom = alumne.cognom;
                    $scope.canviAlumne.edat = alumne.edat;
                    updateValid = alumne.id;
                };

                                
                var resetform = function () {
                    $scope.nouAlumneForm.$setPristine();
                    $scope.nouAlumneForm.nom.$untouched = true;
                    $scope.nouAlumneForm.nom.$touched = false;
                    $scope.nouAlumneForm.cognom.$untouched = true;    
                    $scope.nouAlumneForm.cognom.$touched = false;
                    $scope.nouAlumneForm.edat.$untouched = true;
                    $scope.nouAlumneForm.edat.$touched = false;
                    }; 


                alumnes.get().then((response) => {
                    $scope.alumnes = response.data;
                    console.log(response.data);
                    $scope.loadingTable = false;
                }, (error) => {
                    console.log(error)
                });

                $scope.postalumne = (isValid) => {
                    if (isValid) {
                        $scope.loading = true;
                        var data = {
                            nom: $scope.alumnes.nom,
                            cognom: $scope.alumnes.cognom,
                            edat: $scope.alumnes.edat
                        };
                        var config = {
                            headers: { 'Content-Type': 'application/json' }
                        };

                        alumnes.post(data, config).then(() => {
                            $scope.msg = "creat";
                            alumnes.get().then((response) => {
                                $scope.alumnes = response.data;
                                console.log(response.data);
                                ToastCreate();
                            }, (error) => {
                                console.log(error)
                            });
                            resetform();
                            $scope.loading = false;
                        }, (error) => { console.log(error); }

                        );

                    };
                };   

                var destroyalumne = (alumne) => {
                    $scope.loadingdelete = alumne.id;
                    alumnes.delete(alumne.id, $scope.canviAlumne).then(
                        () => { 
                            alumnes.get().then((response) => {
                                $scope.alumnes = response.data;
                                ToastDelete();
                            }, (error) => {
                                console.log(error)
                                });
                            $scope.loadingdelete = null;
                        },
                        (error) => { console.log(error) }
                    );
                }

                $scope.confirmDelete = (ev, alumne) => {
                    var confirm = $mdDialog.confirm()
                        .title('Estas segur que vols esborrar-lo? ID Alumne: ' + alumne.id)
                        .textContent('L\'alumne que has seleccionat serà esborrat permanentment.')
                        .ariaLabel('Esborrar alumne')
                        .targetEvent(ev)
                        .ok('Si')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function () {
                        destroyalumne(alumne);
                    });
                }



                $scope.updatealumne = (alumne) => {
                    if (updateValid == alumne.id) {
                        $scope.loadingupdate = alumne.id;
                        alumnes.update(alumne.id, $scope.canviAlumne).then(
                            (response) => {
                                console.log(response);
                                alumnes.get().then((response) => {
                                    $scope.alumnes = response.data;
                                    $scope.loadingupdate = null;
                                    $scope.editing = null;
                                    ToastUpdate();
                                }, (error) => {
                                    console.log(error)
                                });
                            }, (error) => {
                                console.log(error);
                                $scope.loadingupdate = null;
                            })
                    } else {
                        console.log("no has editat l alumne");
                    }
                    };




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
                        .textContent('S\'ha creat l\'alumne!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };

            var ToastDelete = function () {
                var pinTo = getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('S\'ha esborrat l\'alumne!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };

            var ToastUpdate = function () {
                var pinTo = getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('S\'ha actualitzat l\'alumne!')
                        .position(pinTo)
                        .toastClass('md-error')
                        .hideDelay(3000));
            };



        }])