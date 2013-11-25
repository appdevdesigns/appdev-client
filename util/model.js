

// maybe other AD.utils have been loaded already:
if (typeof AD.util == "undefined") {
    AD.util = {};
}



if (typeof AD.util.model == 'undefined') {

    (function () {



        AD.util.model = {

                value : function( model ) {

                    if (model) {



                    } else {
                        console.error( 'AD.util.model.value() called with no param');
                    }


                },



                label : function( model ) {


                },

        }

    })();
}