'use strict';

// Declare app level module which depends on views, and core components
angular.module('App', ['ui.router','ngMaterial','home','header','primary']).
    config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider,$mdThemingProvider) {
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

        $urlRouterProvider.otherwise('home');
        $mdThemingProvider.theme('default').primaryPalette('blue')
            .accentPalette('teal')
            .warnPalette('red')
            .backgroundPalette('grey');
        $mdThemingProvider.setDefaultTheme('default');
}]);
