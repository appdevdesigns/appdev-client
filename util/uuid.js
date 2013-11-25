

// maybe other AD.utils have been loaded already:
if (typeof AD.util == "undefined") {
    AD.util = {};
}



if (typeof AD.util.uuid == 'undefined') {

    (function () {


        var uuid = 0;
        AD.util.uuid = function() {
           return ++uuid;
        }

    })();
}