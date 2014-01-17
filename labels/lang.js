(function() {

    /**
     * @class AD.lang
     * @parent AD_Client
     */
    AD.lang = {};

    /**
     * The default language used in operations when nothing is specified.
     */
    AD.lang.currentLanguage = 'en';


    /**
     * @function setCurrentLanguage
     * Sets the default language code to be used for all operations that don't
     * specify one.
     * @param [string] lang
     */
    AD.lang.setCurrentLanguage = function (lang) {
        AD.lang.currentLanguage = lang;
    };


    /**
     * @class AD.lang.label
     * @parent AD.lang
     */
    AD.lang.label = {};

    /**
     * @private
     * This is where the labels are stored.
     */
    var store = {
    /*
        "en": {
            "OK": "Okay",
            "Cancel": "Cancel"
        },
        "zh-hans": {
            "OK": "好",
            "Cancel": "取消"
        },
        "fr": {
            "OK": "Bien",
            "Cancel": "Annuler"
        }
    */
    }


    /**
     * Used internally to track if a warning was already sent to the console.
     */
    var warnings = {};
    var warn = function (langCode) {
        if (!warnings[langCode]) {
            if (typeof console == 'object') {
                console.log("Warning: language not found [" + langCode + "]");
            }
            warnings[langCode] = true;
        }
    };

    /**
     * @function setLabel
     * Set a single label definition.
     * @param [string] key
     * @param [string] label
     * @param [string] langCode (Optional)
     */
    AD.lang.label.setLabel = function (key, label, langCode) {
        langCode = langCode || AD.lang.currentLanguage;
        if (!store[langCode]) {
            store[langCode] = {};
        }
        store[langCode][key] = label;
    };


    /**
     * @function importLabels
     * Sets many label definitions at once.
     * @param [object] data
     *     A JSON object in this format:
     *     {
     *         "en": {
     *             "label key A": "en translation A",
     *             "label key B": "en translation B",
     *             ...
     *         },
     *        ...
     *     }
     */
    AD.lang.label.importLabels = function (data) {
        for (var lang in data) {
            for (var key in data[lang]) {
                AD.lang.label.setLabel(key, data[lang][key], lang);
            }
        }
    };


    /**
     * @function getLabel
     * Retrieve a label given its unique key.
     *
     * @param [string] key
     * @param [array] subs (Optional)
     *     If the retrieved label contains %s placeholders, then those will be
     *     substituted with provided in this argument.
     * @param [string] langCode (Optional)
     * @return [string|false]
     *      False is returned if there was no match for the langCode or key.
     */
    AD.lang.label.getLabel = function (key, subs, langCode) {
        // When subs not given
        if (Object.prototype.toString.call(subs) != '[object Array]') {
            langCode = subs;
            subs = [];
        }
        // When langCode not given
        langCode = langCode || AD.lang.currentLanguage;

        // langCode not found
        if (!store[langCode]) {
            warn(langCode);
            return false;
        }

        // Key not found
        if (!store[langCode][key]) {
            //return "[" + langCode + "]" + key;
            return false;
        }

        var label = store[langCode][key] || key;

        // Substitutions
        label = label.replace(/%%/g, '\\%\\');
        while (subs.length && label.match(/%s/)) {
            label = label.replace(/%s/, subs.shift());
        }
        label = label.replace(/\\%\\/g, '%');

        return label;
    };

})();