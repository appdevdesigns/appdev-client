steal(

	'appdev/widgets/ad_ui_reauth/ad_ui_reauth.js'

).then(function() {


    //Define the unit tests
    describe('ad_ui_reauth Widget', function(){

		var widget;
		var $container;

        before(function(done) {
        	$container = $('<div class="ad-ui-reauth"></div>');
			widget = new AD.widgets.ad_ui_reauth($container);
        	done();
    	});

        it('show widget', function(done){
            widget.show();
			var htmlContent = $container.html();
			chai.assert.isTrue((htmlContent.indexOf('appDev-formLogin') != -1),"Widget wasn't shown");
			done();
        });

        it('hide widget', function(done) {
			widget.hide();
			var htmlContent = $container.html();
			chai.assert.isTrue((htmlContent.indexOf('appDev-formLogin') != -1),"Widget wasn't hidden");
			done();
        });

    });


});
