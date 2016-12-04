'use strict';
var services = angular.module('jobifyApp.services', []);
var url = 'https://jobify-professional.herokuapp.com/';

services.factory('TrabajosService', ['$http', '$q', function($http, $q){

	return {

		getJobPositions: function() {
			return $http.get(url+'job_positions/')
				.then(
					function(response){
						return response.data.job_positions;
					},
					function(errResponse){
						console.error('Error al obtener job positions');
						return $q.reject(errResponse);
					}
				);
		},

		getJobPositionByCategory: function(category) {
			return $http.get(url+'job_positions/categories/'+category)
				.then(
					function(response){
						return response.data.job_positions;
					},
					function(errResponse){
						console.error('Error al obtener job positions de categoria ' + category);
						return $q.reject(errResponse);
					}
				);
		},

		createJobPosition: function(category, data){
			return $http.post(url+'job_positions/categories/'+category, data)
				.then(
					function(response){
						return response.data;
					},
					function(errResponse){
						console.error('Error al crear job position de categoria '+category);
						return $q.reject(errResponse);
					}
				);
		},

		updateJobPosition: function(name,category,dataObject){			
			var datau =JSON.stringify(dataObject);
			
			var datax = '{"job_position": '+datau+'}';
			
			$.ajax({
			    url: url+'job_positions/categories/'+category+'/'+name,
			    type: 'PUT',    
			    data: {"name":"developer","description":" a s22oftwakre developer","category":"software"},
			    dataType: 'json',
			    contentType : 'application/json',
			    success: function(result) {
				alert("success?");
			    },
				error: function(result) {
				alert("error?");
			    }

			});
		},

		deleteJobPosition: function(developer,category){
			return $http.delete(url+'/job_positions/categories/'+category+'/'+developer)
				.then(
					function(response){
						return response.data;
					},
					function(errResponse){
						console.error('Error al eliminar job position con categoria '+category + ' y developer '+ developer);
						return $q.reject(errResponse);
					}
				);
		}

	};

}]);

services.factory('LoginService', ['$http', '$q', function($http, $q){

	return {

		authenticate: function(username,password) {
			if ( username == 'admin' && password == 'admin') {
//				$http.defaults.headers.common['Access-Control-Request-Method'] = '*';
//				$http.defaults.headers.common['Access-Control-Request-Headers'] = '*';
				$http.defaults.headers.common = {};
				$http.defaults.headers.post = {};
				$http.defaults.headers.put = {};
				$http.defaults.headers.patch = {};
				return 'OK';
			} else {
				console.error('Error al querer autenticar con user '+ username + ' y password '+password );
				return $q.reject("Usuario o contraseÃ±a invalido");
			}
		}
	};

}]);
