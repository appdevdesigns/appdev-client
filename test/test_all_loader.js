    // Dependencies
    steal(
        "../../appdev/appdev.js"
    )

    // Initialization
    .then(function(){

        mocha.setup({
            ui: 'bdd',
            timeout: 9000,
            reporter: 'html'
        });
        expect = chai.expect;
        assert = chai.assert;

    })
    .then(
        // load our tests here
        "appdev/test/labels_label.js",
        "appdev/test/labels_lang.js",
        "appdev/test/class_uicontroller.js",
        "appdev/test/appdev_client_config.js",
        "appdev/test/comm_service.js",
		"appdev/test/appdev_client_reauth.js",
		"appdev/test/ad_ui_reauth.js"
    )
    .then(function() {
        // Execute the tests
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    })