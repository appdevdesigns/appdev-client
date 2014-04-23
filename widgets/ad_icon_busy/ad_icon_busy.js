
steal(
        // List your dependencies here:
        'appdev/appdev.js',
        'appdev/widgets/ad_icon_busy/ad_icon_busy.css',
function(){

    AD.widgets.ad_icon_busy = can.Control.extend({


        init: function( element, options ) {
//            var self = this;
            this.options = AD.defaults({
                    width:16,
                    height:16,
                    inline:true,
                    show:false,
                    style:'circleball',   // ['circleball', 'arrow', etc... ]
                    color:'black'
            }, options);

            this.div = null;

            // if this element is a div, then just work with it:
            if ( this.element.is('div')) {
                this.div = this.element;
            } else {
                this.div = $('<div>');
                this.element.append(this.div);

            }

 //           this.div.hide();
            this.div.addClass('hidden');

            var baseStyle = 'ad-icon-busy';
            var styleClass = baseStyle;

            // choose proper style
            var knownStyles = {
                    'circleball':{ black:1, white:1 },
                    'arrow':{ black:1, white:1 },
                    'circle':{ grey:1 }
            };
            if (knownStyles[this.options.style]) {
                styleClass += '-'+this.options.style;

                // choose valid color:
                if (knownStyles[this.options.style][this.options.color]) {
                    styleClass += '-'+this.options.color;
                } else {

                    // their given color didn't match a known option
                    // so pick the 1st that this style has
                    console.warn('ad_icon_busy: unknown color:'+this.options.color);
                    var firstColor = '';
                    for (var c in knownStyles[this.options.style]){
                        if (firstColor == '') {
                            firstColor = c;
                            break;
                        }
                    }
                    console.warn('defaulting to color:'+c);
                    styleClass += '-' + c;
                }

            } else {
                console.warn('ad_icon_busy: unknown style:'+this.options.style);
                styleClass += '-circleball-black';
            }



            // add our baseStyle to the div
            if (!this.div.hasClass(baseStyle)) {
                this.div.addClass(baseStyle);
            }


            // if we want the inline option:
            if (this.options.inline) {
                this.div.addClass(baseStyle+'-inline');
            }


            // choose the right icon
            this.div.addClass(styleClass);


            // show it if requested.
            if (this.options.show) {
                this.div.show();
                this.div.removeClass('hidden');
            }


        },

        show: function() {

            // NOTE: simple this.div.show(); doesn't work correctly for inline icons
            this.div.removeClass('hidden');

        },

        hide: function() {

            this.div.addClass('hidden');

        }



    });


});