define(["js/svgmocker"], function (svgmocker) {
    return function (svg, el) {

        var forEach = Array.prototype.forEach;

        function extractScreens (svg) {
            var screens = {};
            var highLevelGroups = svg.querySelectorAll("svg > g");
            forEach.call(highLevelGroups, function (g) {
                var id = svgmocker.cleanUpId(g.id);
                if (screens[id]) {
                    svgmocker.log("Found duplicate screen with id=" + id);
                }
                screens[id] = svgmocker.extractSlide(g);
            });
            return screens;
        }

        function collectActions (node) {
            var actions = [];
            forEach.call(node.childNodes, function (childNode) {
                actions = actions.concat(collectActions(childNode));
            });
            var id = svgmocker.cleanUpId(node.id);
            var match = /^([^:]*):(.*)/.exec(id);
            if (match) {
                svgmocker.log("Found action " + id);
                actions.push({
                    key: match[1],
                    value: match[2],
                    el: node
                });
            }
            return actions;
        }

        function applyActions (actions, app) {
            actions.forEach(function (action) {
                if (action.key === "link") {
                    action.el.addEventListener("click", function () {
                        app.showScreen(action.value);
                    });
                }
            });
        }

        function createApp (options) {
            options = options || {};
            var svg = options.svg;
            var el = options.el;

            var screens;

            function initialize () {
                svgmocker.log("Extracting screens");
                screens = extractScreens(svg);
                svgmocker.log("Appending start screen");
            }
            function showScreen (id) {
                el.innerHTML = "";
                el.appendChild(screens[id].el);
            }

            return {
                initialize: initialize,
                showScreen: showScreen
            };
        }

        function svgLoaded(svg, el) {
            var startingScreenId = svgmocker.cleanUpId(svg.querySelector("svg > g").id);

            svgmocker.log("Creating the app");
            var app = createApp({
                svg: svg,
                el: el
            });

            svgmocker.log("Collecting actions");
            var actions = collectActions(svg);

            svgmocker.log("Applying actions");
            applyActions(actions, app);

            app.initialize();
            app.showScreen(startingScreenId);
        }

        svgLoaded(svg, el);

    };
});