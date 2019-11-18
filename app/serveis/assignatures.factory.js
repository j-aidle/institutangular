angular.module('serveis')
    .factory('assignatures', ($http) => {
        let actions = {
            get: () => {
                return $http.get('http://localhost:50297/api/assignaturas');
            },
            post: (data, config) => {
                return $http.post('http://localhost:50297/api/assignaturas', data, config);
            },
            delete: (data) => {
                return $http.delete('http://localhost:50297/api/assignaturas/'+ data);
            }
        };
        return actions;
    });
