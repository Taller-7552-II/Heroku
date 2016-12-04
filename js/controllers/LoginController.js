'use strict';
var app = angular.module('jobifyApp.controllers');

app.controller('LoginController',
		function($scope, $rootScope, $location, $cookieStore, LoginService) {

			$scope.rememberMe = false;

			$scope.login = function() {
				var username = $scope.username;
				var password = $scope.password;
				
				var status = LoginService.authenticate(username, password);
				
				if (status != 'OK') {
					$rootScope.error = 'Usuario o contraseÃ±a incorrecto';
					console.error('Error al querer autenticarse');
				} else {
					
					if ($scope.rememberMe) {
						$cookieStore.put('loginUser', username);
						$cookieStore.put('loginPassword', password);
					}
					
					$rootScope.user = username;
					$rootScope.go('/trabajos');
				}
			};

			$scope.reset = function() {
				$scope.username = "";
				$scope.password = "";
				$scope.rememberMe = false;
			};

			$scope.borrarDatosLogin = function() {
				if ($scope.rememberMe == false) {
					$cookieStore.remove('loginUser');
					$cookieStore.remove('loginPassword');
				}
			};

			function rellenarDatosLogin() {
				if ($cookieStore.get('loginUser')
						&& $cookieStore.get('loginPassword')) {
					var loginUser = $cookieStore.get('loginUser');
					var loginPassword = $cookieStore.get('loginPassword');
					$scope.username = loginUser;
					$scope.password = loginPassword;
					$scope.rememberMe = true;
				}
			}

			function init() {
				rellenarDatosLogin();
			}

			init();
				

		});