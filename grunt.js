module.exports = function(grunt) {

    var fs = require('fs');
    var path = require('path');

    var SRC_DIR = 'src';
    var BUILD_DIR = 'build';
    var MAIN_NAME = 'main.js';
    var MAIN_BUILT = path.join(BUILD_DIR, MAIN_NAME);
    var ASSET_DIRS = ['img', 'locales'];

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
        copy: {
            all: {
                files: createCopyConfig()
            }
        },
        compass: {
            dev: {
                src: 'src/sass',
                dest: 'src/stylesheets',
                linecomments: true,
                debugsass: true
            },
            prod: {
                src: 'src/sass',
                dest: 'build/stylesheets',
                outputstyle: 'compressed',
                linecomments: false,
                debugsass: false
            }
        },
        watch: {
            files: ['src/sass/*.sass'],
            tasks: ['compass:dev']
        },
        ghpages: {
            all: {
                repository: 'git@github.com:tehmou/svg-drag-drop-mocker.git'
            }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-mincss');

    grunt.loadTasks('tasks');

    grunt.registerTask('default', 'lint');
    grunt.registerTask('pre-build', 'lint clean requirejs copy');
    grunt.registerTask('build-dev', 'pre-build compass:dev');
    grunt.registerTask('build-prod', 'pre-build min compass:prod');
    grunt.registerTask('deploy-ghpages', 'build-prod ghpages');

};