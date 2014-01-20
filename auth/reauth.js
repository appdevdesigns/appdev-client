(function() {

/**
 * @class AD.ui.reauth
 * This is the controller object used for configuring reAuthentication on the page.
 */
var Reauth = can.Control.extend({
    
		/**
     	* @function init
     	* Initialize the object for reauthentication
     	* @param $element Object 
     	*/
	    init: function($element) {
			this.reauthenting = false;
        	this.reauthKey = $element.attr('ad-ui-reauth');
			
        	if (!this.reauthKey) {
				var $div = $('<div>');
				$element.append($div);
			}
			
			this.widget = new AD.widgets.ad_ui_reauth();
			
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
    	"ad.auth.reauthenticate subscribe": function() {
			this.reauthenting = true;
        	this.widget.show();
    	},
		
		/**
     	* @function success
     	* Reauthenication is finished and the message is sent out.
     	*/
		success: function(){
			
			this.reauthenting = false;
			this.widget.hide();
			AD.comm.hub.subscribe('ad.auth.reauthentication.successful', {});	
		
		}
		
});
	
AD.ui.reauth = Reauth;

})();