angular.module('gestio')
    .controller('gestioController', ['$scope','$mdDialog','$mdToast', 'dades', 
        function gestioController($scope, $mdDialog,$mdToast,dades) {
        
        $scope.loadingCreate = false;
        $scope.loadingdelete = null;
        $scope.loadingupdate = null;
        $scope.loadingTable = true;
        $scope.msgErrorTable = false;
        $scope.editing = null;
        let updateValid = null;

        $scope.propertyName = 'alumne.id';
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
                        console.log(error);
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
                        console.log(response.data);
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
                .textContent('La matricula que has seleccionat ser� esborrada permanentment.')
                .ariaLabel('Esborrar matricula')
                .targetEvent(ev)
                .ok('Si')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                destroygestio(dada);
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

        var ToastDelete = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha esborrat la matricula!')
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

}]);