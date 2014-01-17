/*
**
* @class AD_Client.comm.service
* @parent AD_Client.comm
*
* ##Service
*
* We provide a basic communication method to communicate with our server side
* services.  This routine will automatically respond to reauthenticate
* requests and queue up the service call to be called again.
*
*
* ##Usage:
*
*
*
*/

steal(
        'appdev/sal/web-jquery.js',
        'appdev/comm/hub.js'

).then(function() {




    (function() {



        /**
         * @class AD.comm.service
         * @parent AD_Client
         */
        if (typeof AD.comm == "undefined") {
            AD.comm = {};
        }

        //--------------------------------------------------------------------------
        AD.comm.service = {};


        AD.comm.service.get = function(options, cb) {
            options['method'] = 'GET';
            return request(options, cb);
        };

        AD.comm.service.post = function(options, cb) {
            options['method'] = 'POST';
            return request(options, cb);
        };

        AD.comm.service.put = function(options, cb) {
            options['method'] = 'PUT';
            return request(options, cb);
        };

        AD.comm.service['delete'] = function(options, cb) {
            options['method'] = 'DELETE';
            return request(options, cb);
        };


        /*
         * @private
         *
         * An array to hold any pending requests that are waiting for authentication
         * to complete.
         *
         * The individual entries in the array are objects:
         * { opts:options,  cb:callback,  dfd:deferred }
         *
         */
        var pendingRequests = [];


        var processRequest = function (entry) {

            request( entry.opts, function(err, data) {

                // call the callback if provided.
                if (entry.cb) {
                    entry.cb( err, data);
                }

                // now finish off the deferred for this operation
                if (err) {
                    entry.dfd.reject(err);
                } else {
                    entry.dfd.resolve(data);
                }
            });

        };



        var onAuthSuccessful = function(handle, data) {

            var currReq;
            while( currReq = pendingRequests.shift() ) {
                processRequest(currReq);
            }

        };
        AD.comm.hub.subscribe('ad.auth.reauthentication.successful', onAuthSuccessful);



        /**
         * @function request()
         * @private
         *
         * Make an HTTP request asynchronously.
         *
         * @param {String} options.method
         *    [optional] The HTTP verb to use. Default is POST.
         * @param {String} options.url
         *    The URL to post the request to.
         * @param {Object} options.params
         *    An associative array of field names and values to post.
         * @param {Function} options.complete
         *    The callback function to execute after the request is completed,
         *    before checking whether or not it succeeded or failed.
         * @param {Function} options.success
         *    The callback function to execute if the request is successful.
         * @param {Function} options.failure
         *    The callback function to execute if the request failed.
         * @param {jQuery} options.messageBox
         *    jQuery selection of the message box to display any error messages
         *    in. If not specified, then a dialog box will be used.
         * @param {String} options.showErrors
         *    "ON", "OFF", or "AUTO". Default is AUTO.
         *    Auto means errors will be shown unless a failure callback is
         *    provided.
         */
        var request = function(options, cb) {
            var dfd = AD.sal.Deferred();

            // Default is async, but you can specify 'sync: true' in the options
            // to change to sync mode instead.
            var asyncMode = true;
            if (options.sync) {
                asyncMode = false;
            }
            if (!options.method) {
                options.method = 'POST';
            }


            // if we are currently in process of authenticating, then
            // queue request
/*            if ((typeof AD.winLogin.isVisible != 'undefined')
                && (AppDev.winLogin.isVisible())) {

                var dfd = $.Deferred();
                pendingRequests.push({ opts:options, cb:cb, dfd:dfd });

                return dfd;
            }
*/

            // responds to a { status = false;  .... } responses.
            var _handleAppdevError = function( data ) {

                var errorID = data.id;
                // Authentication failure (i.e. session timeout)
                if (errorID == 5) {

                    // store current request
                    pendingRequests.push({ opts:options, cb:cb, dfd:dfd });

                    // Reauthenticate
                    AD.comm.hub.publish('ad.auth.reauthenticate', {});

                    return;
                }
                // Some other error
                else {

/*
                    var showErrors = options['showErrors'];

                    // Execute the optional failure callback
                    if ($.isFunction(options['failure'])) {
                        options.failure(data);
                        // Turn off showErrors if it wasn't enabled
                        // explicitly.
                        if (!showErrors || showErrors == 'AUTO') {
                            showErrors = 'OFF';
                        }
                    }
                    // No failure callback given
                    else if (!showErrors || showErrors == 'AUTO') {
                      // Turn on showErrors if it wasn't disabled
                      // explicitly.
                      showErrors = 'ON';
                    }

                    // Display error message if needed
                    if (showErrors == 'ON') {
                        var errorMSG = data.error
                            || data.errorMSG
                            || data.errorMessage
                            || data.message;
                        if (!errorMSG) { errorMSG = "Error"; }
                        AppDev.displayMessage(
                            errorMSG,
                            options['messageBox']
                        );
                    }
*/

                    AD.comm.hub.publish('ad.err.notification', data);
                    if (cb) {
                        cb(data);
                    }
                    dfd.reject(data);
                    return;
                }
            };


//            $.ajax({
            AD.sal.http({
                async: asyncMode,
                url: options['url'],
                type: options['method'],
                contentType: options['contentType'],
                dataType: 'json',
                data: options['params'],
                cache: false
            })
            .fail(function(req, status, statusText) {

                    // check to see if responseText is our json response
                    var data = AD.sal.parseJSON(req.responseText);
                    if (('object' == typeof data) && (data != null)) {

                        if ('undefined' != typeof data.status) {

                            // this could very well be one of our messages:
                            _handleAppdevError( data );
                            return;
                        };
                    }

                    // Serious error where we did not even get a JSON response
                    AD.comm.hub.publish('ad.err.notification', data);
                    if (cb) {
                        cb(data);
                    }
                    dfd.reject(data);
                })
            .done(function(data, textStatus, req) {

                // Got a JSON response but was the service response an error?
                if (data.status && (data.status == 'error')) {

                    _handleAppdevError(data);
                    return;
                }
                // Success!
                else {

                    // if this was an appdev packet, only return the data:
                    if (data.status && data.status == 'success') {
                        data = data.data;
                    }


                    if (cb) cb(null, data);
                    dfd.resolve(data);
                }


            }); // ajax()


            return dfd;

        }; // post

    })();
});

