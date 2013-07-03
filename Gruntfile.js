/*jslint node:true */
/*global module, grunt */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),

        // Just concatenate files. Libs and project files are separate.
        concat : {
            fly  : {
                src     : [
                    'src/wrap.start',

                    'src/core/Main.js',
                    'src/core/Util.js',
                    'src/core/ClassSystem.js',
                    'src/core/Registry.js',
                    'src/core/Events.js',
                    'src/core/BaseClass.js',
                    'src/core/TimerManager.js',

                    'src/core/App.js',
                    'src/core/ThreadManager.js',
                    'src/core/Controller.js',
                    'src/core/Error.js',

                    'src/view/View.js',
                    'src/view/List.js',

                    'src/tpl/Abstract.js',
                    'src/tpl/Handlebars.js',
                    'src/tpl/Underscore.js',

//                    'src/core/TouchEvents.js',

                    'src/wrap.end'
                ],
                options : {
                    banner    : '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n',
                    process   : true,
                    separator : ';'
                },
                dest    : 'build/<%= pkg.filename %>.js'
            },
            libs : {
                src     : [
                    'lib/jquery2.js',
//                    'lib/touchevents.js',
                    'lib/jquery.hammer.js',
                    'lib/underscore.js',
                    'lib/json2.js',
                    'lib/backbone.js',
                    'lib/handlebars.js'
                ],
                dest    : 'build/libs.js',
                options : {
                    separator : ";\n"
                }
            }
        },

        // Minify project
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> v<%= pkg.version %> Production <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            fly     : {
                files : {
                    'build/<%= pkg.filename %>.min.js' : [
                        '<%= concat.fly.dest %>'
                    ]
                }
            },
            libs    : {
                files : {
                    'build/libs-min.js' : [
                        '<%= concat.libs.dest %>',
                        '<%= concat.fly.dest %>'
                    ]
                }
            },
            all     : {
                files : {
                    'build/<%= pkg.filename %>-all.min.js' : [
                        '<%= concat.libs.dest %>',
                        '<%= concat.fly.dest %>'
                    ]
                }
            }
        },

        // Watch application js files and Gruntfile for changes
        watch  : {
            scripts : {
                files   : ['src/**/*.js'],
                tasks   : ['minimal'],
                options : {
                    nospawn : true
                }
            }
        }
    });

    grunt.event.on('watch', function (action, filepath) {
        grunt.log.writeln(filepath + ' has ' + action);
    });

    // Load task dependencies
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task - concat dev and watch for changes
    grunt.registerTask('default', ['concat']);

    // Watcher enabled
    grunt.registerTask('w', ['concat', 'watch']);

    // Task used for watch where only Flyleaf is concatenated
    grunt.registerTask('minimal', ['concat:fly']);

    // Task for a full build and minification
    grunt.registerTask('full', ['concat', 'uglify']);
};