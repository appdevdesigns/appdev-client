////
//// Tests for AppDevJS client side labels library
//// Usage: node lang_test.js
////

AD = {};
require('./lang.js');

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


// Tests
if (AD.lang.currentLanguage != 'zh-hans') {
    console.log("setCurrentLanguage() failed");
}

var label = AD.lang.label.getLabel("Hello");
if (!label) {
    console.log("getLabel() failed to find default language");
}
else if (label != "你好") {
    console.log("getLabel() failed to find label in correct language");
}

label = AD.lang.label.getLabel("Hello", "fr");
if (label != "Bonjour") {
    console.log("getLabel() failed to find label in specified language");
}

label = AD.lang.label.getLabel("Yes", "zh-hans");
if (label != "是") {
    console.log("getLabel() failed to find label set by importLabels()");
}

label = AD.lang.label.getLabel("You have %s minutes left", ['5'], 'en');
if (label != 'You have 5 minutes left') {
    console.log("getLabel() should substitute %s symbols when subs and lang given");
    console.log(label);
}

label = AD.lang.label.getLabel("You have %s minutes left", ['5']);
if (label != '你有5分钟时间') {
    console.log("getLabel() should substitute %s symbols when subs given");
    console.log(label);
}

label = AD.lang.label.getLabel("You have %s minutes left", 'en');
if (label != 'You have %s minutes left') {
    console.log("getLabel() should leave %s symbols unchanged when no subs given and lang given");
    console.log(label);
}

label = AD.lang.label.getLabel("You have %s minutes left");
if (label != '你有%s分钟时间') {
    console.log("getLabel() should leave %s symbols unchanged when no subs given");
    console.log(label);
}

label = AD.lang.label.getLabel("Percent");
if (label != '%') {
    console.log("getLabel() should change %% into %");
    console.log(label);
}

label = AD.lang.label.getLabel("Yes", "fr");
if (label) {
    console.log("getLabel() should return FALSE when label key is not found");
    console.log(label);
}
    
