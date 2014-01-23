(function() {


    var requests = {};

    var responses = {
            'url/generic':{
                status:'success',
                data:{ data:true }
            },

            'url/error': {
                status:'error',
                id:1,
                message:'generic error'
            },

            'url/reauth': {
                status:'error',
                id:5,
                message:'reauth'
            }
    };

//    var reAuthed = {};


    var testHttp = function(options) {
        var dfd = AD.sal.Deferred();
        var response = null;

        requests[options.url] = options;
/*
        if (reAuthed[options.url]) {
console.log('found reAuthed request');
console.log(responses['url/generic']);
            dfd.resolve(responses['url/generic']);
            return;
        }
*/

        //// setTimeout() prevents a race condition with the flushing of the queue.
        var resolveIt = function(data) {
            setTimeout(function(){ dfd.resolve(data);},10);
        }

        var rejectIt = function (data) {
            setTimeout(function(){dfd.reject(data);},10);
        }


        if (responses[options.url]) {

            response = responses[options.url];

            if (response.status == 'success') {
                resolveIt(response); //dfd.resolve(response);
            } else {

                var req = { responseText:JSON.stringify(response, null, 4)};
                // if this was not an appdev response:
                if (response.code) {

                    if (response.code < 400) {
                        resolveIt(response); // dfd.resolve(response);
                    } else {
                        rejectIt(req); // dfd.reject(req);
                    }

                } else {

                    // an appdev error message
                    rejectIt(req); // dfd.reject(req);
                }
            }
        } else {
            // default to generic success
            response = responses['url/generic'];
            resolveIt(response); // dfd.resolve(response);
        }
        return dfd;
    };



    describe('AD.comm service',function(){

        var oldHttp = AD.sal.http;

        before(function() {
            // hijack AD.sal.http for our tests.
            AD.sal.http = testHttp;
        });

        after(function(){
            // return AD.sal.http for other tests
            AD.sal.http = oldHttp;
        });



        // .get()  uses method == 'GET'
        it('.get() uses method "GET" ',function(done){
            var url = 'url/get';
            var got = AD.comm.service.get({url:url});
            $.when(got)
            .then(function(gotData){
                assert.equal(requests[url].type.toLowerCase(),'get', ' => uses method GET ');
                done();
            })
            .fail(function(err){
                assert.ok(false, ' => operation should not have failed');
                done();
            });
        });


        // .post() uses method == 'POST'
        it('.post() uses method "POST" ',function(done){
            var url = 'url/post';
            var got = AD.comm.service.post({url:url});
            $.when(got)
            .then(function(gotData){
                assert.equal(requests[url].type.toLowerCase(),'post', ' => uses method post ');
                done();
            })
            .fail(function(err){
                assert.ok(false, ' => operation should not have failed');
                done();
            });
        });


        // .put() uses method == 'PUT'
        it('.put() uses method "PUT" ',function(done){
            var url = 'url/put';
            var got = AD.comm.service.put({url:url});
            $.when(got)
            .then(function(gotData){
                assert.equal(requests[url].type.toLowerCase(),'put', ' => uses method put ');
                done();
            })
            .fail(function(err){
                assert.ok(false, ' => operation should not have failed');
                done();
            });
        });


        // .delete() uses method == 'DELETE'
        it('.delete() uses method "DELETE" ',function(done){
            var url = 'url/delete';
            var got = AD.comm.service['delete']({url:url});
            $.when(got)
            .then(function(gotData){
                assert.equal(requests[url].type.toLowerCase(),'delete', ' => uses method delete ');
                done();
            })
            .fail(function(err){
                assert.ok(false, ' => operation should not have failed');
                done();
            });
        });


        // receiving a reauth response queues the request
        it('receiving a reauth response initiates a reauthenticate notice ',function(done){
            var url = 'url/reauth';
            var isReqComplete=false;
            var isAfterNotification = false;

            var subscriptionID = AD.comm.hub.subscribe('ad.auth.reauthenticate', function(key, data) {

                assert.equal(isReqComplete, false, ' => reauth notification before .then() ');
                isAfterNotification = true;
                AD.comm.hub.unsubscribe(subscriptionID);
                done();

            });

            var got = AD.comm.service.get({url:url});
            $.when(got)
            .then(function(gotData){
                isReqComplete = true;
                assert.equal(isAfterNotification, true, ' => is resolved after reauth.successful message sent. ');
                done();
            })
            .fail(function(err){
                assert.ok(false, ' => operation should not have failed');
                done();
            });
        });



        // an 'ad.auth.reauthentication.successful' notification flushes queue
        // NOTE: the last tests leaves an error message in the queue.
        it('an ad.auth.reauthentication.successful notification flushes queue ',function(done){


            var subID = AD.comm.hub.subscribe('ad.auth.reauthenticate', function(key, data) {

                assert.ok( true, ' => reauth.success results in another reauthenticate ');
                AD.comm.hub.unsubscribe(subID);
                done();

            });


            // not publish the message successful,
            // this results in the queue attempting to flush, which only causes
            // another reauth notice above.
            AD.comm.hub.publish('ad.auth.reauthentication.successful', { data:true });

        });

    });

})();