angular.module('professor')
    .controller('professorController', ['$scope', '$mdDialog', '$mdToast', 'professors',
        function professorController($scope, $mdDialog, $mdToast, professors) {

        //this.orderProp = 'id';
        $scope.propertyName = 'id';
        $scope.reverse = true;

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.loading = false;
        $scope.loadingdelete = null;
        $scope.loadingupdate = null;
        $scope.loadingTable = true;
        $scope.msgErrorTable = false;
        let updateValid = null;

        $scope.editing = null;
        $scope.canviProfessor = {
             nom: "",
             cognom: "",
             edat: ""
        };

        $scope.unsel = () => {
            $scope.editing = null;
        };

        $scope.initupdateprofe = (professor, param) => {
            $scope.editing = professor.id + param;
            $scope.canviProfessor.id = professor.id;
            $scope.canviProfessor.nom = professor.nom;
            $scope.canviProfessor.cognom = professor.cognom;
            $scope.canviProfessor.edat = professor.edat;
            updateValid = professor.id;
         };

        var resetform = function () {
                $scope.nouProfeForm.$setPristine();
                $scope.nouProfeForm.nom.$untouched = true;
                $scope.nouProfeForm.nom.$touched = false;
                $scope.nouProfeForm.cognom.$untouched = true;
                $scope.nouProfeForm.cognom.$touched = false;
                $scope.nouProfeForm.edat.$untouched = true;
                $scope.nouProfeForm.edat.$touched = false;
        }; 
    

        professors.get().then((response) => {
            $scope.professors = response.data;
            $scope.loadingTable = false;
        }, (error) => {
            console.log(error);
            $scope.loadingTable = false;
            $scope.msgErrorTable = true;
        });

        $scope.postprofe = (isValid) => {
            if (isValid) {
                $scope.loading = true;
                var data = {
                    nom: $scope.professors.nom,
                    cognom: $scope.professors.cognom,
                    edat: $scope.professors.edat
                };
                var config = {
                    headers: { 'Content-Type': 'application/json' }
                };

                professors.post(data, config).then(() => {
                    $scope.msg = "creat";
                    professors.get().then((response) => {
                        $scope.professors = response.data;
                        console.log(response.data);
                    }, (error) => {
                        console.log(error)
                    });
                    resetform();
                    $scope.loading = false;
                    ToastCreate();
                }, (error) => {
                    console.log(error);
                }

                );

            };
        };   

        var destroyprofessor = (professor) => {
             $scope.loadingdelete = professor.id;
             professors.delete(professor.id).then(
                () => {
                     professors.get().then((response) => {
                         $scope.professors = response.data;
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


        $scope.confirmDelete = (ev, professor) => {
             var confirm = $mdDialog.confirm()
                 .title('Estas segur que vols esborrar-lo? ID Professor: ' + professor.id)
                 .textContent('El professor que has seleccionat ser� esborrat permanentment.')
                 .ariaLabel('Esborrar professor')
                 .targetEvent(ev)
                 .ok('Si')
                  .cancel('Cancel');
              $mdDialog.show(confirm).then(function () {
                    destroyprofessor(professor);
              }, function () {
                  ToastConfirmDelete();
              });
        };

        $scope.updateprofessor = (professor) => {
            if (updateValid == professor.id) {
                $scope.loadingupdate = professor.id;
                professors.update(professor.id, $scope.canviProfessor).then(
                    () => {
                        professors.get().then((response) => {
                            $scope.professors = response.data;
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
            }else {
            console.log("no has editat el professor!");
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
                    .textContent('S\'ha creat el professor!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };

        var ToastDelete = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha esborrat el professor!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };

        var ToastConfirmDelete = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('No has eliminat el professor!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };


        var ToastUpdate = function () {
            var pinTo = getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('S\'ha actualitzat el professor!')
                    .position(pinTo)
                    .toastClass('md-error')
                    .hideDelay(3000));
        };



    }]);