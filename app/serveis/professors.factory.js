angular.module('serveis')
    .factory('professors', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/Profes');
            }
        };
        return actions;
    });