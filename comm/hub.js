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
        'js/OpenAjax.js'
).then(function() {




if (typeof AD.comm == "undefined") {
    AD.comm = {};
}

//--------------------------------------------------------------------------
AD.comm.hub = {};





/*
 * @function publish
 *
 *  The widget that allowed you to create a new show would then publish
 *  a notification after the show has been created:
 *
 *  @codestart
 *      AD.comm.hub.publish('TVShow.Added', { name:'Hawaii-5-O' });
 *  @codeend
 */
AD.comm.hub.publish = function(key, data){
    OpenAjax.hub.publish(key,data);
}



/*
 * @function subscribe
 *
 *  This widget would want to subscribe to the 'TVShow.Added' notification
 *  like so:
 *
 *  @codestart
 *      var subscriptionID = AD.comm.hub.subscribe('TVShow.Added', function(message, data) {
 *          //add entry contained in data to list
 *          listWidget.addEntry(data);
 *      });
 *  @codeend
 */
AD.comm.hub.subscribe = function(key,callback){
    return OpenAjax.hub.subscribe(key,callback);
}



/*
 * @function unsubscribe
 *
 *  You can unsubscribe from a notification stack as well:
 *
 *  @codestart
 *      AD.comm.hub.unsubscribe(subscriptionID);
 *  @codeend
 */
AD.comm.hub.unsubscribe = function(id){
    OpenAjax.hub.unsubscribe(id);
}



});

