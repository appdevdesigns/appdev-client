(function() {

    var buildTestingHTML = function() {
        var html = [
                    '<div id="reauth-test" class="ad-ui-reauth">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }


    //Define the unit tests
    describe('ReAuthentication Controller', function(){

        var widget;
		var $reauthTest;

        before(function(){

            buildTestingHTML();

			widget = new AD.ui.reauth($('body'));
			$reauthTest = $('#reauth-test');
        });

        it('transforms the HTML', function(){
			var htmlContent = $reauthTest.html();
			chai.assert.isTrue((htmlContent.indexOf('appDev-formLogin') != -1),"Widget wasn't shown");
        });

        it('test inProgress', function() {
			var value = widget.inProgress();
			chai.assert.deepEqual(value,false);
        });
		
		it('test subscribe ad.auth.reauthenticate', function() {
			AD.comm.hub.publish('AD.auth.reauthenticate', {});
			var value = widget.inProgress();
			chai.assert.deepEqual(value,false);
        });
				
		it('test success', function() {
			widget.success();
			var value = widget.inProgress();
			chai.assert.deepEqual(value,false);
        });

    });


})();
