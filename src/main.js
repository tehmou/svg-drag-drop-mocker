requirejs.config({
    shim: {
        "underscore": {
            exports: "_"
        },
        "mustache": {
            exports: "Mustache"
        },
        "jquery": {
            exports: "$"
        },
        "backbone": {
            exports: "Backbone",
            deps: ["underscore", "jquery"]
        },
        "backbone.layoutmanager": {
            exports: "Backbone.LayoutManager",
            deps: ["backbone"]
        }
    },
    paths: {
        "underscore": "lib/underscore",
        "mustache": "lib/mustache",
        "jquery": "lib/jquery-1.8.3.min",
        "backbone": "lib/backbone",
        "backbone.layoutmanager": "lib/backbone.layoutmanager",
        "text": "lib/text"
    }
});

require(["text!data/screens.svg", "js/svgmocker", "js/MainView"], function (svgText, svgmocker, MainView) {
    var model = new Backbone.Model();
    new MainView({
        el: document.body,
        model: model
    }).render();
    model.set({ svgText: svgText });
});