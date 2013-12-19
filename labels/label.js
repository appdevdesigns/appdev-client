(function(){

/**
 * @class AD.controllers.Label
 * This is the controller object used for each label on the page.
 */
var Label = can.Control.extend({
    
    /**
     * @function transform
     *
     * Modify the HTML content of a raw text element to the standard label
     * structure.
     *
     * @param jQuery $element
     * @return jQuery
     *      Returns the SPAN element that will hold the actual label text.
     */ 
    transform: function ($element) {
        var $span = $('<span>');
        $element.empty();
        $element.append($span);
        // TODO??: provide pop-up translator selection icon

        return $span;
    },
    
    defaults: {
        // The label key will be determined by the value of this attribute on
        // the raw text element.
        keyAttribute: "app-label-key",
        
        // The label's current language will be reflected in this attribute
        langAttribute: "app-label-lang",
        
        // After initializing, the text element will be assigned this CSS class
        // for identification.
        cssClass: "ad-label",
        
        // A reference to the controller object will be stored in the element
        // via jQuery data under this name.
        jQueryData: "AD-Label"
    },
    
    // An array of references to all label objects currently in use.
    collection: [],
    
    /**
     * @function translateAll
     * Translates all label controls currently in existence.
     */
    translateAll: function (langCode) {
        // `this` is the Label class
        $.each(this.collection, function() {
            // `this` is now a Label instance
            this.translate(langCode);
        });
    }

}, {
    
    init: function ($element) {
        this.labelKey = $element.attr(this.options.keyAttribute);
        // Skip if no label key, or if this element was already initialized
        if (this.labelKey && !$element.hasClass(this.options.cssClass)) {
            // Init the HTML
            this.$span = this.constructor.transform($element);
            $element.addClass(this.options.cssClass);
            
            // Update static collection
            this.constructor.collection.push(this);
            
            // Provide a reference to this Label object on the HTML element
            $element.data(this.options.jQueryData, this);
            
            this.translate(); // translate into current default language
        }
    },
    
    destroy: function () {
        // Update static collection
        var i = this.constructor.collection.indexOf(this);
        if (i >= 0) {
            this.constructor.collection.splice(i, 1);
        }
        
        can.Control.prototype.destroy.call(this);
    },
    
    /**
     * @function translate
     * @param string langCode (Optional)
     * Changes the text in the label to 
     */
    translate: function (langCode) {
        langCode = langCode || AD.lang.currentLanguage;
        
        var label = AD.lang.label.getLabel(this.labelKey, langCode);
        this.$span.html(label);
        this.element.attr(this.options.langAttribute, langCode);
    },
    
    // Listen for globally published messages requesting translation
    "AD.label.translate subscribe": function(langCode) {
        this.translate(langCode);
    }
    
});



AD.controllers.Label = Label;

})();