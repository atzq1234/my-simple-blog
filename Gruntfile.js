module.exports = function (grunt) {
    grunt.initConfig({
        cafemocha: {
            api: { src: 'qa/test-api.js', options: { ui: 'tdd' } }
        },
        exec: {
            linkchecker: {
                cmd: 'linkchecker http://localhost:3000'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'public/stylesheets/*.css',
                        'views/*.handlebars',
                        'views/**/*.handlebars'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: 'localhost:3000',
                    port: '10086'
                }
            }
        },
        watch: {
            files: 'public/stylesheets/sass/*.scss',
            tasks: ['sass']
        },
        sass: {
            dev: {
                options: {
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    'public/stylesheets/main.css': 'public/stylesheets/sass/main.scss'
                }
            }
        }
    });
    ['grunt-cafe-mocha', 'grunt-exec', 'grunt-browser-sync', 'grunt-contrib-watch', 'grunt-contrib-sass'].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });
    grunt.registerTask('default', []);
    grunt.registerTask('test', ['cafemocha:api']);
    grunt.registerTask('dev', ['browserSync', 'watch']);
};