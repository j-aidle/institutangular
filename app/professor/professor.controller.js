angular.module('professor')
    .controller('professorController', ['$scope', '$mdDialog', '$mdToast', 'professors',
        function professorController($scope, $mdDialog, $mdToast, professors) {

        $scope.loading = false;
        $scope.loadingdelete = null;

        $scope.canviProfessor = {
             nom: "",
             cognom: "",
             edat: ""
        };


        var resetform = function () {
            $scope.nouProfeForm.$setPristine();
            $scope.nouProfeForm.nom.$touched = false;
            $scope.nouProfeForm.nom.$untouched = true;
            $scope.nouProfeForm.cognom.$touched = false;
            $scope.nouProfeForm.cognom.$untouched = true;
            $scope.nouProfeForm.Edat.$touched = false;
            $scope.nouProfeForm.Edat.$untouched = true;
        }; 

        $scope.initupdatealum = (professor, param) => {
            $scope.editing = professor.id + param;
            $scope.canviProfessor.id = professor.id;
            $scope.canviProfessor.nom = professor.nom;
            $scope.canviProfessor.cognom = professor.cognom;
            $scope.canviProfessor.edat = professor.edat;
        };

        professors.get().then((response) => {
            $scope.professors = response.data;
            console.log(response.data);
        }, (error) => {
            console.log(error);
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
                }, (error) => { console.log(error); }

                );

            };
        };   

            var destroyprofessor = (professor) => {
                $scope.loadingdelete = professor.id;
                professors.delete(professor.id, $scope.canviProfessor).then(
                    () => {
                        professors.get().then((response) => {
                            $scope.professors = response.data;
                            console.log(response.data);
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
                .textContent('El professor que has seleccionat serà esborrat permanentment.')
                .ariaLabel('Esborrar professor')
                .targetEvent(ev)
                .ok('Si')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                destroyprofessor(professor);
            });
        }



    }]);