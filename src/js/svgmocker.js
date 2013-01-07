define(function () {
    
    var svgns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";

    function log () {
        if(window.console) {
            console.log.apply(console, Array.prototype.slice.call(arguments));
        }
    }

    function filterNodeListById (nodeList, regExString) {
        var regExp = new RegExp(regExString);
        var filteredNodes = [];
        Array.prototype.slice.call(nodeList).forEach(function (node) {
            if (regExp.exec(node.id)) {
                filteredNodes.push(node);
            }
        });
        return filteredNodes;
    }

    function findSlideShape (g) {
        var shape;
        var rects = Array.prototype.slice.call(g.childNodes);
        rects.forEach(function (rect) {
            if (/^shape/.exec(rect.id)) {
                shape = rect;
            }
        });
        return shape;
    }

    function getSvgValue (animatedLength) {
        return animatedLength.baseVal.value;
    }

    function calculateReverseTransform (rect) {
        return "matrix(1 0 0 1 " + -getSvgValue(rect.x) + " " + -getSvgValue(rect.y) + ")";
    }

    function createSlideSvgFromGroup (g, shape) {
        var svg = document.createElementNS(svgns, "svg");
        g.setAttribute("transform", calculateReverseTransform(shape));
        svg.appendChild(g);
        return svg;
    }

    function extractSlide (g) {
        var shape = findSlideShape(g);
        if (!shape) {
            throw "No shape defined for " + g.id;
        }
        var slideWidth = getSvgValue(shape.width);
        var slideHeight = getSvgValue(shape.height);
        var slideSvg = createSlideSvgFromGroup(g, shape);
        var el = document.createElement("div");

        el.style.width = slideWidth + "px";
        el.style.height = slideHeight + "px";
        el.appendChild(slideSvg);
        shape.style.opacity = 0;

        return {
            width: slideWidth,
            height: slideHeight,
            svg: slideSvg,
            el: el
        };
    }

    function cleanUpId (id) {
        // Take all of the characters until the first underscore.
        // Illustrator has a habit of naming groups of duplicate name
        // group_1_, group_2_ and so on.
        return (/^([^_]*)/).exec(id)[1];
    }

    function findAndCreateSlides (svg, nameRegEx) {
        nameRegEx = nameRegEx || "^slide";
        var slides = [];
        filterNodeListById(svg.querySelectorAll("g"), nameRegEx).forEach(function (g) {
            slides.push(extractSlide(g));
        });
        return slides;
    }

    function loadSVG (url, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                var svg = document.importNode(request.responseXML.documentElement, true);
                callback(svg);
            }
        };
        request.send(null);
    }

    return {
        log: log,
        svgns: svgns,
        xlinkns: xlinkns,
        cleanUpId: cleanUpId,
        extractSlide: extractSlide,
        findAndCreateSlides: findAndCreateSlides,
        loadSVG: loadSVG
    };
});