angular.module('gestio')
    .controller('gestioController', ['$scope','$mdDialog','$mdToast', 'dades','alumnes','professors','assignatures', 
        function gestioController($scope, $mdDialog,$mdToast,dades, alumnes,professors,assignatures) {
        
        $scope.loadingCreate = false;
        $scope.loadingdelete = null;
        $scope.loadingupdate = null;
        $scope.loadingTable = true;
        $scope.msgErrorTable = false;
        $scope.editing = null;
        let updateValid = null;


            $scope.filtro = "";
            $scope.filtroX = "";



        $scope.propertyName = 'dada.id';
        $scope.reverse = true;

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            };


        //$scope.$on('removed', deletegestio);
        //$scope.$on('updated', updategestio);
        $scope.$on('created', postgestio);
        $scope.$on('refresh', fresh);

        $scope.unsel = () => {
            $scope.editing = null;
            };

            $scope.canviGestio = {
            id: "",
            alumneid: "",
            professorid: "",
            assignaturaid: ""
            };
            
        $scope.initupdategestio = (dada, param) => {
            $scope.editing = dada.id + param;
            $scope.canviGestio.id = dada.id;
            $scope.canviGestio.alumneid = dada.alumne.id;
            $scope.canviGestio.professorid = dada.professor.id;
            $scope.canviGestio.assignaturaid = dada.assignatura.id;
            updateValid = dada.id;
        };
        

        dades.get().then(
            (response) => { 
                $scope.dades = response.data; 
            }, (error) => {
                console.log(error);
            });

        function fresh() {
            $scope.loadingTable = true;
            dades.get().then(
            (response) => { 
                $scope.dades = response.data;
                $scope.loadingCreate = false; 
                $scope.loadingTable = false;
                $scope.editing = null;
            }, (error) => {
                console.log(error);
                $scope.msgErrorTable = true;
                $scope.loadingTable = false;
            });
        };
        fresh();

        function postgestio(event, isValid, novaGestio){
            if (isValid){
                $scope.loadingCreate = true;
                dades.post(novaGestio).then(
                  (response)=>{
                      fresh();
                      ToastCreate();
                    },(error)=>{
                        //console.log(error);
                        ToastErrorCreate();
                        $scope.loadingCreate = false;
                });
            }
            }

        var destroygestio = (dada) => {
            $scope.loadingdelete = dada.id;
            dades.delete(dada.id).then(
                () => {
                    dades.get().then((response) => {
                        $scope.dades = response.data;
                        ToastDelete();
                    }, (error) => {
                        console.log(error);
                    });
                    $scope.loadingdelete = null;
                },
                (error) => { console.log(error) }
            );
        }; 

        $scope.confirmDelete = (ev, dada) => {
            var confirm = $mdDialog.confirm()
                .title('Estas segur que vols esborrar-lo? ID Matricula: ' + dada.id)
                .textContent('La matricula que has seleccionat serà esborrada permanentment.')
                .ariaLabel('Esborrar matricula')
                .targetEvent(ev)
                .ok('Si')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                destroygestio(dada);
            }, function () {
                ToastConfirmDelete();
            });
        };

        $scope.updategestio = (dada) => {
            if (updateValid == dada.id) {
                $scope.loadingupdate = dada.id;
                //console.log($scope.canviGestio.alumneid);
                dades.update(dada.id, $scope.canviGestio).then(
                    () => {
                        dades.get().then((response) => {
                            $scope.dades = response.data;
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
                console.log("no has editat la matricula!");
            }

            };


            //Afegim alumnes, profes i assignatures per als desplegables.
            alumnes.get().then((response) => {
                $scope.alumnes = response.data;
                $scope.loadingTable = false;
            }, (error) => {
                console.log(error)
                $scope.loadingTable = false;
                $scope.msgErrorTable = true;
                });

            professors.get().then((response) => {
                $scope.professors = response.data;
                $scope.loadingTable = false;
            }, (error) => {
                console.log(error);
                $scope.loadingTable = false;
                $scope.msgErrorTable = true;
                });

            assignatures.get().then((response) => {
                $scope.assignatures = response.data;
                $scope.loadingTable = false;
            }, (error) => {
                //console.log(error);
                $scope.loadingTable = false;
                $scope.msgErrorTable = true;
            }
            );



// TOAST

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        var toastPosition = angular.extend({}, last);

        var getToastPosition = function () {
            sanitizePosition();

            return Object.keys(toastPosition)
                .filter(function (pos) {
                    return toastPosition[pos];
                }).join(' ');
        };

        var sanitizePosition = function () {
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
        };

        var ToastCreate = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha creat la matricula!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };

        var ToastErrorCreate = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('No has posat bé alguna id, no s\ha creat!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };

        var ToastDelete = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha esborrat la matricula!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };
        var ToastConfirmDelete = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('No has eliminat la matricula!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };

        var ToastUpdate = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha actualitzat la matricula!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };
        

        //var ToastErrorGet = function () {
        //    var pinTo = getToastPosition();

        //    $mdToast.show(
        //        $mdToast.simple()
        //            .textContent('No s\'ha pogut llegir la dada')
        //            .position(pinTo)
        //            .toastClass('md-error')
        //            .hideDelay(3000));
        //};

        //var ToastErrorUpdate = function () {
        //var pinTo = getToastPosition();

        //    $mdToast.show(
        //        $mdToast.simple()
        //        .textContent('No existeix aquest objecte')
        //        .position(pinTo)
        //        .toastClass('md-error')
        //        .hideDelay(3000));
        //};

}]);