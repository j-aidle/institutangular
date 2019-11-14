angular.module('matricula')
    .controller('matriculaController',
        ['$scope', 'alumnes',
            function matriculaController($scope, alumnes)
            {
            alumnes.get().then((response) => {
                $scope.alumnes = response.data;
                console.log(response.data);
            }, (error) => {
                console.log(error)
            });

                $scope.postalumne = (isValid) => {
                    if (isValid) {
                        var data = {
                            nom: $scope.alumnes.nom,
                            cognom: $scope.alumnes.cognom,
                            edat: $scope.alumnes.edat
                        };
                        var config = {
                            headers: { 'Content-Type': 'application/json' }
                        };

                        alumnes.post(data,config).then(() => {
                            $scope.msg = "creat";
                            alumnes.get().then((response) => {
                                $scope.alumnes = response.data;
                                console.log(response.data);
                            }, (error) => {
                                console.log(error)
                            });
                            $scope.alumnes.nom = "";
                            $scope.alumnes.cognom = "";
                            $scope.alumnes.edat = "";
                        }, (error) => { console.log(error); }

                        );

                    }}
            

        }])