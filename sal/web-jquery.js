/*
**
* @class AD_Client.sal.web-jquery.js
* @parent AD_Client.sal
*
* ##Software Abstraction Layer
*
* Provide an abstraction layer between our library and the javascript library
* we are running in.
*
* This is designed to make it easier to port appdev library between a web
* environment using jQuery and other environments (nodejs, titanium, etc...)
* that don't use jQuery.
*
* ##Usage:
*
*
*
*/

steal(

        'appdev/comm/hub.js'

).then(function() {




    (function() {



        /**
         * @class AD.sal
         * @parent AD_Client
         */
        if (typeof AD.sal == "undefined") {
            AD.sal = {};
        }

        //--------------------------------------------------------------------------
        /*
         * return a deferred or a promise.
         */
        AD.sal.Deferred = function() {
            return $.Deferred();
        };



        //--------------------------------------------------------------------------
        /*
         * use this for making http requests
         */
        AD.sal.http = function(options) {
            return $.ajax(options);
        };



        //--------------------------------------------------------------------------
        /*
         * parse your json string into an object
         */
        AD.sal.parseJSON = function(text) {
            return $.parseJSON(text);
        };



        //--------------------------------------------------------------------------
        /*
         * queue the given fn to be run immediately after all other events in Event
         * loop complete.
         */
        AD.sal.setImmediate = function(fn) {
            setTimeout(fn,0);
        };


    })();
});

