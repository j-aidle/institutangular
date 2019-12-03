angular.module('gestio')
    .controller('gestioController', ['$scope','$mdDialog','$mdToast', 'dades', 
        function gestioController($scope, $mdDialog,$mdToast,dades) {
        
        $scope.loadingCreate = false;
        $scope.loadingdelete = null;
        $scope.editing = null;
        
        //$scope.$on('removed', deletegestio);
        //$scope.$on('updated', updategestio);
        $scope.$on('created', postgestio);
        $scope.$on('refresh', fresh);

        dades.get().then(
            (response) => { 
                $scope.dades = response.data; 
            }, (error) => {
                console.log(error);
            });

        function fresh () {
            dades.get().then(
            (response) => { 
                $scope.dades = response.data;
                $scope.loadingCreate = false; 
                $scope.editing = null;
            }, (error) => {
                console.log(error);
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