'use strict';
var app = angular.module('jobifyApp.controllers');

app.controller(
				'TrabajosController',
				[
						'$scope',
						'$rootScope',
						'TrabajosService',
						function($scope, $rootScope, TrabajosService) {

							$scope.trabajos = [];
							$scope.dirty = 	{
									name : '',
									description : '',
									category : ''
							};


							$scope.fetchAllTrabajos = function() {
								TrabajosService
										.getJobPositions()
										.then(
												function(d) {
													$scope.trabajos = d;
												},
												function(errResponse) {
													console
															.error('Error obteniendo trabajos');
												});
							};
							
							$scope.fetchTrabajosByCategory = function() {
								var category = $scope.queryResultados;
									
								if (category != "") {
								
									TrabajosService
											.getJobPositionByCategory(category)
											.then(
													function(d) {
														$scope.trabajos = d;
													},
													function(errResponse) {
														console
																.error('Error obteniendo trabajos por categoria');
													});
								} else {
									$scope.fetchAllTrabajos();
								}
							};
							
							$scope.reload = function() {
								
							};
							
							$scope.writeDirty = function(nombre,descripcion,categoria) {
								$scope.dirty.name = nombre;
								$scope.dirty.description = descripcion;
								$scope.dirty.category = categoria;
							};
							
							$scope.putServis = function(nombre,descripcion,categoria) {
								var dataObject = {
										name : nombre,
										description : descripcion,
										category : categoria
								};			

																
								TrabajosService
											.updateJobPosition($scope.dirty.name,$scope.dirty.category,dataObject);
								
								$scope.fetchAllTrabajos();
							};


							$scope.fetchAllTrabajos();

						} ]);
