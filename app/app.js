'use strict';

// Declare app level module which depends on views, and core components
angular.module('App', ['ui.router', 'ngMaterial', 'ngMessages', 'home', 'header', 'landing-page', 'serveis', 'alumne','assignatura','professor','gestio','directives'])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider,$mdThemingProvider) {

        $stateProvider.state('landing-page', {
            url: '/',
            views: {
                'header': {
                    templateUrl: './pages/header/header.template.html',
                    controller: 'headerController'
                },
                'menu': {
                    templateUrl: './pages/header/menu.template.html',
                    controller: 'headerController'
                },
                'primary': {
                    templateUrl: './pages/landingPage/landingPage.template.html',
                    controller: 'landingPageController'
                }
            }
        })
        $stateProvider.state('landing-page.home', {
            url: 'home',
            views: {
                'primaryx': {
                    templateUrl: './pages/home/home.template.html',
                    controller: 'homeController'
                }
            }
        });
        $stateProvider.state('landing-page.alumne', {
            url: 'alumne',
            views: {
                'primaryx': {
                    templateUrl: './pages/alumne/alumne.template.html',
                    controller: 'alumneController'
                }
            }
        });
        $stateProvider.state('landing-page.assignatura', {
            url: 'assignatura',
            views: {
                'primaryx': {
                    templateUrl: './pages/assignatura/assignatura.template.html',
                    controller: 'assignaturaController'
                }
            }
        });
        $stateProvider.state('landing-page.professor', {
            url: 'professor',
            views: {
                'primaryx': {
                    templateUrl: './pages/professor/professor.template.html',
                    controller: 'professorController'
                }
            }
        });
        $stateProvider.state('landing-page.gestio', {
            url: 'gestio',
            views: {
                'primaryx': {
                    templateUrl: './pages/gestio/gestio.template.html',
                    controller: 'gestioController'
                }
            }
        });

        $urlRouterProvider.otherwise('/');

        $mdThemingProvider.theme('default').primaryPalette('blue')
            .accentPalette('teal')
            .warnPalette('red')
            .backgroundPalette('grey');
        $mdThemingProvider.setDefaultTheme('default');
}]);
