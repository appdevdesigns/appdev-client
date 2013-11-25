/*
**
* @class AD_Client.comm.hub
* @parent AD_Client.comm
*
* ##Hub
*
* We repackage the OpenAjax.hub as our notification center.
*
*
* ##Usage:
*
*  suppose we have a nifty widget on a screen that displays a list of
*  favorite TV shows.  Each time a new TV Show is created, it wants to
*  refresh it's list of shows.
*
*  Please see the code examples in AD.comm.hub.publish and AD.comm.hub.subscribe
*  for instructions on how to do this.
*
*/

steal(
        'appdev/comm/hub.js'
).then(function() {




/*
 * @function model.update
 *
 *  When we receive a realtime update from sails, the data will be published
 *  to 'ad.sails.model.update'.
 *
 *  This method will listen for that message and direct it properly.
 *
 *  @codestart
 *      AD.comm.hub.publish('TVShow.Added', { name:'Hawaii-5-O' });
 *  @codeend
 */
var modelUpdate = function(key, data){

    console.log(data);

    var model = data.model || null;
    if (model) {

        var ModelKey = model.charAt(0).toUpperCase() + model.slice(1);

        if (AD.models[ModelKey]) {

            // this is for a model we know about, so let's go!
            var Model = AD.models[ModelKey];

            // if this message relates to a Model we are already tracking:
            if (Model.store[data.id]) {


                if (data.verb == 'update') {

                    var currValues = Model.store[data.id].attr();

                    var isNew = false;
                    for (var v in data.data) {
                        if (currValues[v] != data.data[v]) { isNew = true };
                    }

                    // if we have new data then update the Model.store
                    if (isNew) {
//console.log(' comet:: updating Model.store:');

                        Model.store[data.id].attr(data.data);
                    }

                } else if (data.verb = "destroy") {

                    // model needs to be removed:
                    Model.store[data.id].destroyed();

                }

            } else {

                // this is about a Model we currently don't know about:
                // Let's just add it:
                new Model(data.data);

                if (Model.store[data.id]) {
                    console.log('model added and stored!');
                } else {
                    console.log('model added but NOT stored!');
                }
            }

        }
    }
}
AD.comm.hub.subscribe('ad.sails.model.update', modelUpdate);



});

