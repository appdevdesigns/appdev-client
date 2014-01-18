(function() {


    // build the DOM that our controller will work on
    // NOTE: div#id=class_uicontroller
    var buildTestingHTML = function() {
        var html = [
                    '<div id="class_uicontroller">',
                    '<dl>',
                    '<dt>Hello:</dt>',
                    '    <dd><span app-label-key="Hello">A</span></dd>',
                    '',
                    '<dt>Goodbye:</dt>',
                    '    <dd><span app-label-key="Goodbye">B</span></dd>',
                    '</dl>',
                    '',
                    '<button lang="en">EN</button>',
                    '<button lang="zh-hans">ZH-HANS</button>',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }

    var defineChildController = function() {

        AD.controllers.myWidget = AD.classes.UIController.extend({}, {
            init: function ($el) {
                // Call parent init
                AD.classes.UIController.prototype.init.apply(this, arguments);

                $el.css({
                    border: "solid blue 1px",
                    display: 'block',
                    width: '20em',
                    margin: '2em',
                    padding: '1em'
                });
            },

            'button click': function (el, ev) {
                var langCode = $(el).attr('lang');
                this.translateLabels(langCode);
            }
        });

    }



    var initializeLabelsStore = function() {

     // Initialize labels store
        AD.lang.setCurrentLanguage('en');
        AD.lang.label.importLabels({
            "en": {
                "Hello": "Hey",
                "Goodbye": "See ya"
            },
            "zh-hans": {
                "Hello": "你好",
                "Goodbye": "再见"
            }
        });
    }


    //Define the unit tests
    describe('Labels UI Controller', function(){

        var widget;
        var $labels;

        before(function(){

            buildTestingHTML();
            defineChildController();
            initializeLabelsStore();


            // Initialize the controller
            widget = new AD.controllers.myWidget($('#class_uicontroller'));

            // Select label elements for testing
            // NOTE: only select things within our #class_uicontroller
            $labels = $('#class_uicontroller span[app-label-key]');
        });


        it('translates to default language on initialization', function(){
            expect( $labels.eq(0).text() ).to.equal('Hey');
            expect( $labels.eq(1).text() ).to.equal('See ya');
        });

        it('.translateLabels()', function(){
            widget.translateLabels('zh-hans');
            expect( $labels.eq(0).text() ).to.equal('你好');
            expect( $labels.eq(1).text() ).to.equal('再见');
        });

    });



})();