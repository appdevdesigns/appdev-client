(function() {

    /**
     * @class AD.config
     * @parent AD_Client
     */
	if (typeof AD.config == "undefined") {
		AD.config = {};
	}
    
    /**
     * @private
     * This is where the config values are stored.
     */
    var storage = {};
    
    /**
     * @function setValue
     * Set a single value definition.
     * @param [string] key
     * @param [string] value
     */
    AD.config.setValue = function (key, value) {
        storage[key] = value;
    };
    
    /**
     * @function getValue
     * Retrieve a value from the config settings.
     *
     * @param [string] key   
     * @return [string|false]
     *      False is returned if there was no match for the key.
     */
    AD.config.getValue = function (key) {
        
        // Key not found
        if (!storage[key]) {
            return false;
        }
        
        var value = storage[key];
        
        return value;
    };

})();