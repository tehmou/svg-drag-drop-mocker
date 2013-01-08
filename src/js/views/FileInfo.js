define([
    "backbone",
    "handlebars",
    "text!html/FileInfo.html"
], function (Backbone, Handlebars, tmpl) {
    return Backbone.View.extend({
        render: function () {
            this.$el.html(Handlebars.compile(tmpl)(this.model.toJSON()));
        }
    });
});