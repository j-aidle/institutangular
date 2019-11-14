angular.module('serveis')
    .factory('alumnes', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/alumnes');
            },
            post: (data, config) => {
                return $http.post('http://localhost:50297/api/alumnes', data, config);
            },
            delete: (data) => {
                return $http.delete('http://localhost:50297/api/alumnes/' + data);
            },
            update: (data, config) => {
                return $http.put('http://localhost:50297/api/alumnes/' + data, config);
            }
        };
        return actions;
    });
