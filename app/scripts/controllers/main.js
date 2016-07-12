'use strict';

/**
 * @ngdoc function
 * @name nohoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nohoApp
 */


app.controller('MainCtrl', function ($scope, $rootScope) {
    
    $scope.title = "EtherSignal"
	$rootScope.alerts = [];
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});