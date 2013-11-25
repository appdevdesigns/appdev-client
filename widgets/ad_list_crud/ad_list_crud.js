
steal(
        'appdev/appdev.js',
        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        'projectRequest/views/ProjectList/ProjectList.ejs',
function(){



    AD.widgets.ad_list_crud = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM:   'appdev/widgets/ad_list_crud/list_dom.ejs',
                    templateEdit:  'appdev/widgets/ad_list_crud/list_edit.ejs',
                    templateAdd:   '',
                    templateItems: 'appdev/widgets/ad_list_crud/list_item.ejs'
            }, options);



            this.dataSource = this.options.dataSource || []; // AD.models.Projects;

            this._editModel = null;

            this.initDOM();
            this.loadItems();


            this._delObj = new AD.widgets.ad_delete_ios(this.element,{
                sel_button_delete:'.ad-item-delete',
                sel_item:'.ad-list-item',
                widthSelect:'95%',
                widthConfirm:'90%',
                onDelete:function() { self.onDelete();   }
            });


            // these events are generated from teh ad_delete_ios widget:
            this.element
                .on('ad.delete.ios.done', function(){
                    // delete mode is finished
                    self._mode = 'show';
                })
                .on('ad.delete.ios.choosing', function(){
                    // delete mode started
                    self._mode='delete';
                })
                .on('ad.delete.ios.confirmed', function(ev, data){
                    var inHere = true;
                    self.onDelete(data.el)

                });

/*
            AD.comm.hub.subscribe('projects.update', function(label, data){
                self.catchEvent(label,data);
            })
*/
            this._mode = 'show';
        },


/*
        catchEvent:function(label, data) {

            console.log('caught event ['+label+']');
            console.log(data);

        },
*/


        clearItemList: function() {
            this.element.find('.ad-list-item').each(function(item){ item.remove(); });
        },



        hideEditForm: function() {
            var self = this;

            this._editForm.slideToggle('slow', function(){
                self._editForm.html('');
                self._mode = 'show';
                self._delObj.enable();
            });
            this._listArea.slideToggle('slow');


        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateDOM, {} ));
            this._listArea = this.element.find('.ad-list-area');
            this._editForm = this.element.find('.ad-edit-form');
            this._editForm.slideToggle('fast');
            this._buttonAdd = this.element.find('.ad-item-add');
        },



        loadItem: function(item, listArea) {
            var self = this;

            if (!listArea) {
                listArea = this.element.find('.ad-list');
            }

            var domFrag = can.view(this.options.templateItems, { item: item });
            listArea[0].appendChild(domFrag);


//            var cont = $(domFrag).first();
//            cont.attr('ad-list-crud-del-id', item.id);

            //// now on each model displayed, listen to it's destroyed event
            // when destroyed, .remove() this domFrag.
            var bindThis = function(model, frag) {

                var delThis = function (ev, attr){
                    if (attr == 'destroyed') {
                        self.element.find('[ad-list-crud-del-id='+model.id+']').remove();
                    }
                }
                model.bind('change',delThis);

            };
            bindThis(item, domFrag);

        },



        loadItems: function() {
            var self = this;

            var listArea = this.element.find('.ad-list');

            this.clearItemList();

            for (var i=0; i<this.dataSource.length; i++) {
                this.loadItem(this.dataSource[i], listArea);
            }
        },



        onDelete: function($item) {

            var model = $item.data('ad-model');

            model.destroy()
                .then(function(){
                    $item.remove();
                })
                .fail(function(err){
//// TODO: implement an AD.alert() method to show error messages
                    alert('An Error happened!');
                });
        },



        showEditForm: function(model, template) {

            // default to edit form if template not provided
            template = template || this.options.templateEdit;


            this._editForm.html('');
            this._editForm[0].appendChild(can.view(template, {model:model}));


            // slide display list out
            this._listArea.slideToggle('slow');
            // slide edit form in.
            this._editForm.slideToggle('slow');
        },



        updateModel: function(el) {
            if (this._mode == 'edit') {
                if (this._editModel) {
                    var oldVal = this._editModel.attr(el.attr('name'));
                    var newVal = el.val();

                    if (oldVal != newVal) {
                        this._editModel.attr(el.attr('name'), el.val()).save();
                    }

                } else {
                    console.error(' _editModel is null !!!');
                }
            }

        },



        '.ad-item-add click': function(el, ev) {
            // clicking the [Add] button, should show an empty edit form

            if (this._mode == 'show') {

                this._buttonAdd.addClass('disabled');

                var project = el.data('ad-model');
                this._editModel = project;

                if (this.options.templateAdd == '') {
                    // try to show a blank edit form
                    this.showEditForm(null);
                } else {
                    this.showEditForm(null, this.options.templateAdd);
                }

                this._mode = 'add';
                this._delObj.disable();
            }

            ev.preventDefault();
        },



        'li.ad-list-item click': function(el, ev) {
            // clicking an item in the list should show the edit form with that item.

            if (this._mode == 'show') {

                this._buttonAdd.addClass('disabled');
                var project = el.data('ad-model');
                this._editModel = project;

                this.showEditForm(project);

                this._mode = 'edit';
                this._delObj.disable();
            }

        },



        '.ad-submit click': function(el, ev) {
            // clicking on the [submit] button on the form: updates the data & display
            var self = this;

            if ( this._mode == 'add') {

                // serialize and save the new entry

 //               var form = this.element.find('form');
                var values = can.deparam(this._editForm.find('form').serialize());

                // convert this into a model that is based upon this dataSource & save() back to server.
                var newModel = new this.dataSource.constructor.Observe(values);
                newModel.save().then(function(values){

                    // now add it to the datasource
                    self.dataSource.push(newModel);

                    // and display it
                    self.loadItem(newModel);
                })



            }

            // if this was an update, the values should be changing as
            // they were made.

            this._editModel = null;
            this.hideEditForm();

            this._buttonAdd.removeClass('disabled');
            ev.preventDefault();
        },



        '.ad-cancel click': function(el, ev) {
            // clicking on the edit form's [cancel] button hides the form and
            // reenables the buttons

            var self = this;


            this._editModel = null;

            this.hideEditForm();
            this._buttonAdd.removeClass('disabled');
            ev.preventDefault();

        },



        '.ad-edit-form input focusout': function( el, ev) {

            // any input has been left
            this.updateModel(el);
        },



        '.ad-edit-form textarea focusout': function( el, ev) {

            // any input has been left
            this.updateModel(el);
        },



        '.ad-edit-form input keyup': function( el, ev) {

            // pressing [enter] in an input field
            if (ev.keyCode == 13) {
                this.updateModel(el);
            }
        },



        '.ad-edit-form select change': function( el, ev) {

            this.updateModel(el);
        }


    });


});