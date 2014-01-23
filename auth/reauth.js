steal(
        'appdev/widgets/ad_ui_reauth/ad_ui_reauth.js',
		'appdev/comm/hub.js'

).then(function() {
	
/**
* @class AD.ui
* @parent AD_Client
*/
if (typeof AD.ui == "undefined") {
   AD.ui = {};
}

//--------------------------------------------------------------------------

/**
 * @class AD.ui.reauth
 * This is the controller object used for configuring reAuthentication on the page.
 */
AD.ui.reauth = can.Control.extend({
},{
		/**
     	* @function init
     	* Initialize the object for reauthentication
     	* @param $element Object 
     	*/
	    init: function($element) {
			this.reauthenting = false;
        	this.reauthKey = $element.find('.ad-ui-reauth');
			
			this.widget = new AD.widgets.ad_ui_reauth($element.find('.ad-ui-reauth'));
			
			$element.append(this.widget);
    	},
		
	 	/**
     	* @function inProgress
     	* Return true is the user need to be reauthenticated and false otherwise 
     	*/
    	inProgress: function() {
			
			if (this.reauthenting){
				return true;
			}else{
				return false;
			}
    	},

	 	/**
     	* @function 'ad.auth.reauthenticate' subscribe
     	*  Listen to initiate reauthenicating the user
     	*/
    	"AD.auth.reauthenticate subscribe": function() {
			this.reauthenting = true;
        	this.show();
    	},
		
		/**
     	* @function success
     	* Reauthenication is finished and the message is sent out.
     	*/
		success: function(){
			
			this.reauthenting = false;
			this.widget.hide();
			AD.comm.hub.publish('ad.auth.reauthentication.successful', {});	
		
		}
		
});

})();