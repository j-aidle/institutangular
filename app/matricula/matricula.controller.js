angular.module('matricula')
    .controller('matriculaController',
        ['$scope', 'alumnes',
            function matriculaController($scope, alumnes)
            {
                $scope.loading = false;
                $scope.loadingdelete = null;
<<<<<<< HEAD
                
                var resetform = function () {
                    $scope.nouAlumneForm.$setPristine();
                    $scope.nouAlumneForm.nom.$touched = false;
                    $scope.nouAlumneForm.nom.$untouched = true;
                    $scope.nouAlumneForm.cognom.$touched = false;
                    $scope.nouAlumneForm.cognom.$untouched = true;
                    $scope.nouAlumneForm.Edat.$touched = false;
                    $scope.nouAlumneForm.Edat.$untouched = true;
                }; 

=======
>>>>>>> cd4b4927600ee23dd561f3582b3ee31565c3ad8d

            alumnes.get().then((response) => {
                $scope.alumnes = response.data;
                console.log(response.data);
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
                            }, (error) => {
                                console.log(error)
                            });
<<<<<<< HEAD
                            resetform();
=======
                            $scope.alumnes.nom = "";
                            $scope.alumnes.cognom = "";
                            $scope.alumnes.edat = "";
>>>>>>> cd4b4927600ee23dd561f3582b3ee31565c3ad8d
                            $scope.loading = false;
                        }, (error) => { console.log(error); }

                        );

                    }
            }   

            $scope.destroyalumne = (alumne) => {
                $scope.loadingdelete = alumne.id;
                alumnes.delete(alumne.id).then(
                    () => { 
                        
                        alumnes.get().then((response) => {
                            $scope.alumnes = response.data;
                        }, (error) => {
                            console.log(error)
                            });
                        $scope.loadingdelete = null;
                    },
                    (error) => { console.log(error) }
                );
            }
        

        }])