
steal(
        // List your dependencies here:
        //'appdev/appdev.js',
        'appdev/widgets/ad_ui_reauth/ad_ui_reauth.css',
function(){

    AD.widgets.ad_ui_reauth = can.Control.extend({


        init: function( element, options ) {
            var self = this;
			
			this.element = element;
			var authType = AD.config.getValue( 'authType' );
			
			if (authType == "CAS"){
				this.element.html(can.view('../../appdev/widgets/ad_ui_reauth/reauth_cas.ejs', {} ));
			}else{
				this.element.html(can.view('../../appdev/widgets/ad_ui_reauth/reauth_local.ejs', {} ));
			}

            this.element.hide();


        },

        show: function() {

            this.element.removeClass('hidden');

        },

        hide: function() {

            this.element.addClass('hidden');

        }



    });


})();