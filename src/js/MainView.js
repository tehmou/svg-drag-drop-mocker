define([
    "backbone",
    "js/Screens",
    "js/views/FileInfo"
], function (Backbone, Screens, FileInfo) {
    return Backbone.View.extend({
        initialize: function () {
            Backbone.View.prototype.initialize.apply(this, arguments);
            _.bindAll(this);
            this.model.on("change:svgText", this.svgTextChange);
            this.model.on("change:svgFile", this.svgFileChange);
        },
        svgTextChange: function () {
            var doc = new DOMParser().parseFromString(this.model.get("svgText"), "application/xml");
            var svg = document.importNode(doc.documentElement, true);
            this.model.set({ svg: svg });
        },
        svgFileChange: function () {
            var svgFile = this.model.get("svgFile");
            this.model.get("svgFileInfo").set({
                name: svgFile.name,
                size: svgFile.size
            });
            this.fileInfo.render();
        },
        downloadSvg: function () {
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
                this.model.set({
                    svgFile: file,
                    svgText: reader.result
                });
            }, this);
            reader.readAsText(file);
        },
        render: function () {
            this.el.addEventListener("drop", this.onDrop);
            $("#viewSvg", this.el).click(this.viewSvg);
            $("#downloadSvg", this.el).click(this.downloadSvg);
            $("#playSvg", this.el).click(this.playSvg);

            var fileInfo = new FileInfo({ model: this.model.get("svgFileInfo") });
            fileInfo.render();
            this.fileInfo = fileInfo;
            $("#file-info", this.el).append(fileInfo.el);
        }
    });
});