angular.module('serveis')
    .factory('dades', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/dadas');
            },
            post: (data, config) => {
                return $http.post('http://localhost:50297/api/dadas', data, config);
            },
            delete: (data) => {
                return $http.delete('http://localhost:50297/api/dadas/' + data);
            },
            update: (data, content) => {
                return $http.put('http://localhost:50297/api/dadas/' + data, content);
            }
        };
        return actions;
    });
