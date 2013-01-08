module.exports = function (grunt) {
    var spawn = require('child_process').spawn;

    grunt.registerMultiTask('ghpages', 'Update gh-pages on for github repository', function () {
        var repository = this.data.repository;
        var commitMessage = this.data.commitMessage || 'Overwriting commit';
        var branch = this.data.branch || 'gh-pages';

        var done = this.async();
        var gitCommands = [
            ['init'],
            ['checkout', '-b', branch],
            ['add', '.'],
            ['commit', '-m', commitMessage],
            ['remote', 'add', 'origin', repository],
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