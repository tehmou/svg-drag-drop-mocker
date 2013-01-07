module.exports = function(grunt) {

    var fs = require('fs');
    var path = require('path');

    var SRC_DIR = 'src';
    var BUILD_DIR = 'build';
    var MAIN_NAME = 'main.js';
    var MAIN_BUILT = path.join(BUILD_DIR, MAIN_NAME);
    var ASSET_DIRS = ['img', 'locales', 'stylesheets'];

    function createCopyConfig () {
        var copyConfig = {};
        ASSET_DIRS.forEach(function (assetFolder) {
            var src = path.join(SRC_DIR, assetFolder);
            var dest = path.join(BUILD_DIR, assetFolder) + path.sep;
            if (fs.readdirSync(src).length > 0) {
                copyConfig[dest] = path.join(src, '**');
            }
        });
        copyConfig[path.join(BUILD_DIR, 'lib', 'require.js')] = path.join(SRC_DIR, 'lib', 'require.js');
        copyConfig[path.join(BUILD_DIR, 'index.html')] = path.join(SRC_DIR, 'index.html');

        return copyConfig;
    }

    function createMinCssConfig () {
        var minCssFiles = {};
        minCssFiles[path.join(BUILD_DIR, 'stylesheets', 'screen.css')] = path.join(BUILD_DIR, 'stylesheets', 'screen.css');
        return {
            compress: { files: minCssFiles }
        };
    }

    grunt.initConfig({
        lint: {
            all: ['grunt.js', path.join('src', 'js', '**', '*.js')]
        },
        requirejs: {
            compile: {
                name: 'main',
                mainConfigFile: path.join(SRC_DIR, 'main.js'),
                baseUrl: 'src',
                out: MAIN_BUILT
            }
        },
        clean: {
            build: BUILD_DIR
        },
        min: {
            main: {
                src: [MAIN_BUILT],
                dest: MAIN_BUILT
            }
        },
        mincss: createMinCssConfig(),
        copy: {
            assets: {
                options: {
                    excludeEmpty: true
                },
                files: createCopyConfig()
            }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-mincss');

    grunt.loadTasks('tasks');

    grunt.registerTask('default', 'lint');
    grunt.registerTask('build-dev', 'lint clean requirejs copy');
    grunt.registerTask('build-min', ['build-dev', 'min', 'mincss']);

};