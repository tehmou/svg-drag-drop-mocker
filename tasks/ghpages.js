module.exports = function (grunt) {
    var spawn = require('child_process').spawn;

    grunt.registerTask('ghpages', function () {
        var done = this.async();
        var gitCommands = [
            ['init'],
            ['checkout', '-b', 'gh-pages'],
            ['add', '.'],
            ['commit', '-m', 'Overwriting commit'],
            ['remote', 'add', 'origin', 'git@github.com:tehmou/svg-drag-drop-mocker.git'],
            ['push', '-f', 'origin', 'gh-pages']
        ];

        function runNextCommand() {
            var command = gitCommands.shift();
            if (!command) {
                done();
            } else {
                console.log("git " + command.join(" "));
                var git = spawn('git', command, { cwd: 'build' });
                git.stdout.on('data', function (data) { console.log(''+data); });
                git.stderr.on('data', function (data) { console.log(''+data); });
                git.on('exit', runNextCommand);
            }
        }

        runNextCommand();
    });
};