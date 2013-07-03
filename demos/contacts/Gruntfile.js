/*jslint node:true */
/*global module, grunt */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),

        // Just concatenate files. Libs and project files are separate.
        concat : {
            app     : {
                src  : [
                    'app/**/*.js'
                ],
                options: {
                    banner : '/* Contacts app, a Flyleaf framework example */\n',
                    separator: ';'
                },
                dest : 'build/<%= pkg.filename %>.js'
            }
        },

        // Minify project
        uglify : {
            app     : {
                files : {
                    'build/<%= pkg.filename %>.min.js' : [
                        '../../build/fly-all.min.js',
                        '<%= concat.app.dest %>'
                    ]
                }
            }
        },

        // Watch application js files and Gruntfile for changes
        watch  : {
            scripts : {
                files   : ['app/**/*.js', 'app.js', '../../build/*.js'],
                tasks   : ['default'],
                options : {
                    nospawn : true
                }
            }
        }
    });

    // Load task dependencies
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task - full build
    grunt.registerTask('default', ['concat', 'uglify']);

    // Watcher enabled
    grunt.registerTask('w', ['concat', 'watch']);
};