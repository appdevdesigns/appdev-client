(function() {

    describe('test AD.config object',function(){

    	it('test AD.config.setValue and AD.config.getValue',function(done){
    		AD.config.setValue('test', 'Test Text');
    		var value = AD.config.getValue('test');
    		chai.assert.deepEqual(value,'Test Text');
    		done();
    	});

    });

})();