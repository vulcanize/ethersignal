// spec.js
describe('EtherSignal main', function() {
	var herotitle = element(by.id('herotitle'));
	var submitBtn = element(by.id('submitBtn'));

	beforeEach(function() {
		browser.get('http://localhost:9000/');
		browser.waitForAngular();
	});	
	
	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('EtherSignal');
	});	
	
	it('should have a title logo', function() {
		expect(herotitle.getText()).toEqual('EtherSignal');
	});	

	it('should have a submit button', function() {
		expect(submitBtn.getText()).toEqual('Submit a position');
	});	

});

// webdriver-manager start
// protractor conf.js