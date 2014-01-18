(function() {

    var buildTestingHTML = function() {
        var html = [
                    '<div id="labels_label">',
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

        // Initialize the label controllers on the page
        $('#labels_label dd span').each(function(){
            var $this = $(this);
            $this.css({ background: "yellow" });
            new AD.controllers.Label($this);
        });

        // Initialize the manual translation buttons
        $('#labels_label button').on("click", function() {
            var langCode = $(this).attr('lang');
            AD.controllers.Label.translateAll(langCode);
        });
    }


    //Define the unit tests
    describe('Labels Controller', function(){

        var $labels;

        before(function(){

            buildTestingHTML();
            initializeLabelsStore();


            $labels = $('#labels_label [app-label-key]');
        });

        it('transforms the HTML', function(){
            return expect( $labels.hasClass('ad-label') ).to.be["true"];
        });

        it('translates on initialization', function() {
            expect( $labels.eq(0).text() ).to.equal('Hey');
            expect( $labels.eq(1).text() ).to.equal('See ya');
        });

        it('individual .translate()', function(){
            $labels.eq(0).data('AD-Label').translate('zh-hans');
            expect( $labels.eq(0).text() ).to.equal('你好');
            $labels.eq(0).data('AD-Label').translate('en');
            expect( $labels.eq(0).text() ).to.equal('Hey');
        });

        it('collective .translateAll()', function(){
            AD.controllers.Label.translateAll('zh-hans');
            expect( $labels.eq(0).text() ).to.equal('你好');
            expect( $labels.eq(1).text() ).to.equal('再见');
        });

    });


})();
