# Single-Page Backbone Template Project

This is a very opinionated template project for creating a JS-heavy web application. It is basically shaped to be something I like to use myself. Use at your own discretion. Ideas and improvements welcome.

You may want to check [BBB](https://github.com/backbone-boilerplate/grunt-bbb) for a more complete project builder. It didn't exactly match my needs, though, so I created my own.



## Setup

1. Clone the directory with Git
2. Install NodeJS
3. Install Grunt with `npm install -g grunt`
4. Install node dependencies by running `npm install` in the project directory
5. Install Ruby and Compass
6. For compiling the styles, go to src directory and run `compass compile`, or `compass watch` for automatically compiling styles
7. Build the project with grunt with either `grunt build-dev` or `grunt build-min`


## Included JS libraries

* RequireJS
* JQuery
* Mustache
* Underscore
* Backbone
* Backbone.Layout


## Limitations

* SASS styles are not compiled when building the project
* No test runner yet
* No locale library
* No sample project
* A bit of an ugly build script, though it works