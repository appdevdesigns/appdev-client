/**
 * @class AD_Client
 * @parent index 4
 *
 * ###Client side global AD namespace.
 *
 * This file defines standard functions and calls for appDev
 * objects on the client side.
 */

// Create our AD  Namespace only if it hasn't been created already
if (typeof window.AD == 'undefined') {


    AD = {};

    /**
     * @class AD.labels
     * @parent AD_Client
     *
     * Repository for javascript based labels.
     */

    AD.labels = {};

    /**
     * @class AD.listLabels
     * @parent AD_Client
     *
     * Repository for javascript based labels.
     */

    AD.listLabels = {};


    AD.controllers = {};    // UI Controllers: user interactions and displays
    AD.models = {};         // Models and data access
    AD.models_base = {};    //    --> appdev generated Model Files
    AD.widgets = {};        // Reusable Widgets for UI display
    AD.classes = {};        // Domain Models

    AD.defaults = function(defObj, optObj) {
        if (optObj) {
            for (var o in optObj) {
                defObj[o] = optObj[o];
            }
        }
        return defObj;
    }


    steal(
            'js/jquery.min.js',
            'appdev/comm/hub.js',
            'appdev/util/uuid.js'

    )
    .then(
            'canjs/can.jquery.js'
    )
    .then(
            'appdev/model/model.js',
            function($) {

console.log('AD setup done ...');

            }
    );


}
