angular.module('professor')
    .controller('professorController', ['$scope','professors', function professorController($scope,professors) {


        var resetform = function () {
            $scope.nouProfeForm.$setPristine();
            $scope.nouProfeForm.nom.$touched = false;
            $scope.nouProfeForm.nom.$untouched = true;
            $scope.nouProfeForm.cognom.$touched = false;
            $scope.nouProfeForm.cognom.$untouched = true;
            $scope.nouProfeForm.Edat.$touched = false;
            $scope.nouProfeForm.Edat.$untouched = true;
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




    }]);