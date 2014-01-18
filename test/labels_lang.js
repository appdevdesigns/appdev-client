

//Define the unit tests
describe('Language Framework', function(){


    before(function(){
        // Init
        AD.lang.label.setLabel("Hello", "Hello");
        AD.lang.setCurrentLanguage('zh-hans');
        AD.lang.label.setLabel("Hello", "你好");
        AD.lang.label.setLabel("Hello", "Bonjour", "fr");
        AD.lang.label.importLabels({
            "en": {
                "Yes": "Yes",
                "No": "No",
                "You have %s minutes left": "You have %s minutes left",
                "Percent": "%%"
            },
            "zh-hans": {
                "Yes": "是",
                "No": "不",
                "You have %s minutes left": "你有%s分钟时间",
                "Percent": "%%"
            }
        });
    });

    it('can set default language', function(){
        AD.lang.setCurrentLanguage('zh-hans');
        expect(AD.lang.currentLanguage).to.equal('zh-hans');
    });

    it('can translate to default language', function() {
        expect(AD.lang.label.getLabel('Hello')).to.equal('你好');
    });

    it('can translate to specified language', function() {
        expect(AD.lang.label.getLabel('Hello', 'fr')).to.equal('Bonjour');
    });

    it('can find label set by importLabels()', function(){
        expect(AD.lang.label.getLabel('Yes', 'zh-hans' )).to.equal('是');
    });

    it('substitutes %s symbols when subs are given', function(){
        var label = AD.lang.label.getLabel('You have %s minutes left', ['5']);
        expect(label).to.equal('你有5分钟时间');
    });

    it('leaves %s symbols unchanged when no subs are given', function(){
        var label = AD.lang.label.getLabel('You have %s minutes left');
        expect(label).to.equal('你有%s分钟时间');
    });

    it('changes %% symbols into %', function(){
        var label = AD.lang.label.getLabel('Percent');
        expect(label).to.equal('%');
    });

    it('returns falsy when a label key is not found', function() {
        expect(AD.lang.label.getLabel('Yes', 'fr')).to.be['false'];
    });


});