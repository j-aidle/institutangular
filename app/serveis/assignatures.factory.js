angular.module('serveis')
    .factory('assignatures', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/assignaturas');
            }
        };
        return actions;
    });
