
steal(
        // List your dependencies here:
        'appdev/appdev.js',
        'appdev/widgets/ad_delete_ios/ad_delete_ios.css',
        'js/jQueryRotateCompressed.js',

function(){

    AD.widgets.ad_delete_ios = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateWrapper: 'appdev/widgets/ad_delete_ios/content_wrapper.ejs',
                    templateButtons: 'appdev/widgets/ad_delete_ios/buttons.ejs',
                    sel_button_delete: '.ad-delete-ios-button-delete',
                    sel_button_done: '.ad-delete-ios-button-done',
                    sel_item:'.ad-delete-ios-item',
                    widthSelect:'80%',
                    widthConfirm:'50%',
                    onDelete:null
            }, options);



            this._buttonDelete = this.element.find(this.options.sel_button_delete);
            this._buttonDone = this.element.find(this.options.sel_button_done);

            if (this._buttonDone.length == 0) {
                this._buttonDone = $('<a class="'+this.options.sel_button_done+' btn btn-default" style="float:right" href="#">Done</a>');
                this._buttonDelete.after( this._buttonDone );
            }
            this._buttonDone.hide();


            this._buttonDelete.click(function(ev) {
                self.onDeleteClick(ev);
            });

            this._buttonDone.click(function(ev) {
                self.onDoneClick(ev);
            });

        },



        disable: function() {

            this._buttonDelete.addClass('disabled');
            this._buttonDone.addClass('disabled');
        },



        enable: function() {

            this._buttonDelete.removeClass('disabled');
            this._buttonDone.removeClass('disabled');
        },



        onDeleteClick: function(ev) {

            this.element.trigger('ad.delete.ios.choosing');

            // find all .sel_item's
            // insert our DOM
            this.wrapContent();

            this.element.find('.ad-delete-ios-pane_left').fadeIn();
            this.element.find('.ad-delete-ios-pane_center').width(this.options.widthSelect);

            // hide .sel_button_delete
            this._buttonDelete.hide();
            // show .sel_button_done
            this._buttonDone.show();

            ev.preventDefault();
        },



        onDoneClick: function(ev) {

            //var $el = $(ev.currentTarget);

            this.unWrapContent();

         // show .sel_button_done
            this._buttonDone.hide();

            // hide .sel_button_delete
            this._buttonDelete.show();

            this.element.trigger('ad.delete.ios.done');


            ev.preventDefault();
        },



        unWrapContent: function() {
            var self = this;
            var items = this.element.find(this.options.sel_item);

            items.each(function(index, item) {

                var $item = $(item);
                self.unWrapItem($item);

            })
        },



        unWrapItem: function ( $item ) {

            $item.find('.ad-delete-ios-pane_left').remove();
            $item.find('.ad-delete-ios-pane_right').remove();
            $item.find('.ad-delete-ios-wrapped').unwrap().unwrap().unwrap().remove();

        },



        wrapContent: function() {
            var self = this;
            var items = this.element.find(this.options.sel_item);

            items.each(function(index, item) {

                var $item = $(item);

                // insert a marker as  'wrapped' so we can unwrap them later.
                $item.prepend($('<span class="ad-delete-ios-wrapped"></span>'));


                var innerStuff = can.view.render(self.options.templateWrapper, {});
//                $item.wrapInner( can.view.render(self.options.templateWrapper, {}));  // wrapInner() : looses contents when given document fragement, so send string

                $item.wrapInner( [

'<div class="ad-delete-ios-wrapper">',
'<div class="ad-delete-ios-pane ad-delete-ios-pane_center">',
    '<div class="ad-delete-ios-pane__content">',
    '</div>',
'</div>',
'</div>',

                                  ].join(""))
                $item.find('.ad-delete-ios-wrapper').prepend(can.view(self.options.templateButtons, {}));

            })
        },



        '.ad-delete-ios-pane_left click': function (el, ev) {
            var self = this;

            var $el = $(el);
//            $el.parent().find('.ad-delete-ios-pane_center').width(this.options.widthConfirm);
//            $el.parent().find('.ad-delete-ios-pane_right').show().removeClass('hide');


            // they clicked the 'minus' icon next to an entry
            var myDelConf = $el.parent().find('.ad-delete-ios-pane_right');
            var myContent = $el.parent().find('.ad-delete-ios-pane_center');

            // if initial click
            var rotation = $el.getRotateAngle();
            if ((rotation == '') || (rotation == 0)) {

                // rotate me
                $el.rotate({animateTo:90, duration:500, callback: function() {
                 // show the [delete] confirmation
                    myContent.width(self.options.widthConfirm);
                    myDelConf.show().removeClass('hide');;
                }});


            } else {
                // unrotate me
                $el.rotate({animateTo:0, duration:500, callback:function(){}});
                // hide my [delete] confirmation
                myContent.width(self.options.widthSelect);
                myDelConf.hide();
            }// end if


            ev.stopPropagation();  // don't bubble up

        },


        '.ad-delete-ios-pane_right click': function( el, ev) {

            ev.stopPropagation();

            // this widget simply reports back to the calling controller
            // which selected item should be deleted.

            // unwrap this item
            var $item = $(el).closest(this.options.sel_item);
            this.unWrapItem($item);


            this.element.trigger('ad.delete.ios.confirmed', { el: $item });

        }





    });


});