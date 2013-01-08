requirejs.config({
    shim: {
        "underscore": {
            exports: "_"
        },
        "handlebars": {
            exports: "Handlebars"
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
        "handlebars": "lib/handlebars",
        "jquery": "lib/jquery",
        "backbone": "lib/backbone",
        "backbone.layoutmanager": "lib/backbone.layoutmanager",
        "text": "lib/text"
    }
});

require(["text!data/screens.svg", "js/svgmocker", "js/MainView"], function (svgText, svgmocker, MainView) {
    var model = new Backbone.Model({
        svgFileInfo: new Backbone.Model({
            name: "screens.svg",
            size: "5245"
        })
    });
    new MainView({
        el: document.body,
        model: model
    }).render();
    model.set({ svgText: svgText });
});