'use strict';

/**
 * @ngdoc function
 * @name nohoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nohoApp
 */


app.controller('MainCtrl', function ($scope) {
    
    $scope.questions = [
        {id: 'question1', name: 'Should we hard fork?'},
        {id: 'question2', name: 'Is Ether awesome?'},
        {id: 'question3', name: 'Bro, do you even blockchain?'}
    ];

  });