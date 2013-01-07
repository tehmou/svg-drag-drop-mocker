define([
    "backbone",
    "js/Screens"
], function (Backbone, Screens) {
    return Backbone.View.extend({
        initialize: function () {
            Backbone.View.prototype.initialize.apply(this, arguments);
            _.bindAll(this);
            this.model.on("change:svgText", this.svgTextChange);
        },
        svgTextChange: function () {
            var doc = new DOMParser().parseFromString(this.model.get("svgText"), "application/xml");
            var svg = document.importNode(doc.documentElement, true);
            this.model.set({ svg: svg });
        },
        downloadSvg: function () {
            console.log(this.model.get("svg"));
            var a = document.createElement("a");
            a.href = 'data:Application/octet-stream,' + encodeURIComponent(this.model.get("svgText"));
            a.download = "youFile.svg";
            a.click();
        },
        viewSvg: function () {
            $("#svgContent", this.el).html("").append(this.model.get("svg"));
        },
        playSvg: function () {
            new Screens(this.model.get("svg"), document.body);
        },
        onDrop: function (e) {
            e.preventDefault();
            var files = e.target.files || e.dataTransfer.files;
            if (files.length !== 1) {
                alert("Please drag only one SVG file.");
            }
            var file = files[0];
            var reader = new FileReader();
            reader.onload = _.bind(function () {
                this.model.set({ svgText: reader.result });
            }, this);
            reader.readAsText(file);
        },
        render: function () {
            this.el.addEventListener("drop", this.onDrop);
            $("#viewSvg", this.el).click(this.viewSvg);
            $("#downloadSvg", this.el).click(this.downloadSvg);
            $("#playSvg", this.el).click(this.playSvg);
        }
    });
});