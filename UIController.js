/**
 * @class AD.classes.UIController
 * @parent can.Control
 *
 * Identical to can.Control except it automatically scans its contents during
 * initialization and sets up all elements with the 'app-label-key' attribute
 * as Label controls. These labels can then be translated using the 
 * translateLabels() method.
 */
AD.classes.UIController = can.Control.extend({
    // Static properties
    
},{
    // Instance properties
    
    init: function ($element) {
        this.labels = [];

        var keyAttr = AD.controllers.Label.defaults.keyAttribute;
        var $labels = $element.find('[' + keyAttr + ']');
        var self = this;
        
        $labels.each(function(){
            self.labels.push( new AD.controllers.Label($(this)) );
        });
        
    },
    
    /**
     * @function translateLabels
     * @param string lang (Optional)
     */
    translateLabels: function (lang) {
        $.each(this.labels, function(){
            this.translate(lang);
        });
    }
    
});
