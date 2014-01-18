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
    }
    var testHttp = function(options) {
        var dfd = AD.sal.Deferred();
        var response = null;

        requests[options.url] = options;

        if (responses[options.url]) {

            response = responses[options.url];

            if (response.status == 'success') {
                dfd.resolve(response);
            } else {
                // if this was not an appdev response:
                if (response.code) {

                    if (response.code < 400) {
                        dfd.resolve(response);
                    } else {
                        dfd.reject(response);
                    }

                } else {

                    // an appdev error message
                    dfd.reject(response);
                }
            }
        } else {
            // default to generic success
            response = responses['url/generic'];
            dfd.resolve(response);
        }
        return dfd;
    }

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
                assert.ok(false, ' => operations should not have failed');
                done();
            });
        });

        // .post() uses method == 'POST'

        // .put() uses method == 'PUT'

        // .delete() uses method == 'DELETE'

        // receiving a reauth response queues the request

        // an 'ad.auth.reauthentication.successful' notification flushes queue


    });

})();