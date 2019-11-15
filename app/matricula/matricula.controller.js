angular.module('matricula')
    .controller('matriculaController',
        ['$scope', 'alumnes',
            function matriculaController($scope, alumnes)
            {
                $scope.loading = false;
                $scope.loadingdelete = null;
                $scope.loadingupdate = null;

                $scope.editing = null;
                $scope.canviAlumne = {
                    nom: "",
                    cognom: "",
                    edat: ""
                };
                $scope.initupdatealum = (alumne, param) => {
                    $scope.editing = alumne.id + param;
                    $scope.canviAlumne.id = alumne.id;
                    $scope.canviAlumne.nom = alumne.nom;
                    $scope.canviAlumne.cognom = alumne.cognom;
                    $scope.canviAlumne.edat = alumne.edat;

                };

                                
                var resetform = function () {
                    $scope.nouAlumneForm.$setPristine();
                    $scope.nouAlumneForm.nom.$touched = false;
                    $scope.nouAlumneForm.nom.$untouched = true;
                    $scope.nouAlumneForm.cognom.$touched = false;
                    $scope.nouAlumneForm.cognom.$untouched = true;
                    $scope.nouAlumneForm.Edat.$touched = false;
                    $scope.nouAlumneForm.Edat.$untouched = true;
                }; 


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
                            resetform();
                            $scope.loading = false;
                        }, (error) => { console.log(error); }

                        );

                    }
            }   

            $scope.destroyalumne = (alumne) => {
                $scope.loadingdelete = alumne.id;
                alumnes.delete(alumne.id, $scope.canviAlumne).then(
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

                $scope.updatealumne = (alumne) => {
                    $scope.loadingupdate = alumne.id;
                    alumnes.update(alumne.id, $scope.canviAlumne).then(
                        (response) => {
                            console.log(response);
                            alumnes.get().then((response) => {
                                $scope.alumnes = response.data;
                                console.log(response.data);
                            }, (error) => {
                                console.log(error)
                                });
                            $scope.loadingupdate = null;
                            $scope.editing = null;
                        }, (error) => {
                            console.log(error);
                        })
                };

        

        }])