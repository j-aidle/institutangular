'use strict';

// Declare app level module which depends on views, and core components
angular.module('App', ['ui.router', 'ngMaterial', 'home', 'header', 'primary', 'serveis', 'alumne'])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider,$mdThemingProvider) {
        $stateProvider.state('layout', {
            url: '',
            views: {
                'header': {
                    templateUrl: './header/header.template.html',
                    controller: 'headerController'
                },
                'menu': {
                    templateUrl: './header/menu.template.html',
                    controller: 'headerController'
                },
                'primary': {
                    templateUrl: './primary/primary.template.html',
                    controller: 'primaryController'
                }
            }
        })
        $stateProvider.state('layout.home', {
            url: '/home',
            views: {
                home: {
                    templateUrl: './home/home.template.html',
                    controller: 'homeController'
                }
            }
        });
        $stateProvider.state('layout.alumne', {
            url: '/alumne',
            views: {
                home: {
                    templateUrl: './alumne/alumne.template.html',
                    controller: 'alumneController'
                }
            }
        });


        $urlRouterProvider.otherwise('home');
        $mdThemingProvider.theme('default').primaryPalette('blue')
            .accentPalette('teal')
            .warnPalette('red')
            .backgroundPalette('grey');
        $mdThemingProvider.setDefaultTheme('default');
}]);
