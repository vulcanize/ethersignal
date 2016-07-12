'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('nohoApp'));

  var $controller;

  beforeEach(angular.mock.inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Controller: MainCtrl', function() {
    it('it should have a title', function() {
      var $scope = {};
      var controller = $controller('MainCtrl', { $scope: $scope });
      expect($scope.title).toEqual('EtherSignal');
    });
  }); 

});


describe('proposalService test', function(){

    describe('when I call proposalService.proposals', function(){
        beforeEach(module('nohoApp'));
        it('is is defined', inject(function(proposalService){ //parameter name = service name
            expect( proposalService.proposals ).toBeDefined()
        }))
    })

    describe('when I call proposalService.vote', function(){
        beforeEach(module('nohoApp'));
        it('is is defined', inject(function(proposalService){ //parameter name = service name
            expect( proposalService.vote ).toBeDefined()
        }))
    })

});

describe('ethereum service test', function(){

    describe('when I call ethereum.web3', function(){
        beforeEach(module('nohoApp'));
        it('is is defined', inject(function(ethereum){ //parameter name = service name
            expect( ethereum.web3 ).toBeDefined()
        }))
    })

});






