angular.module('serveis')
    .factory('professors', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/Profes');
            },
            post: (data,config) => {
                return $http.post('http://localhost:50297/api/Profes',data,config);
            },
            delete: (data) => {
                return $http.delete('http://localhost:50297/api/Profes/' + data);
            }
        };
        return actions;
    });