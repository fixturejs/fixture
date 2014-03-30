module.exports = function( grunt ) {
  var _ = require( "underscore" );
  _.str = require( "underscore.string" );

  grunt.config.init({
    // Expose underscore to the template processor.
    _: _,

    pkg: grunt.file.readJSON( "package.json" ),

    // Concatenates build and source files into a single file.
    concat: {
      options: {
        process: true
      },
      dist: {
        src: [ "build/start.jst", "src/<%= pkg.name %>.js", "build/end.jst" ],
        dest: "dist/<%= pkg.name %>.js"
      }
    },

    // TODO
    //jscs: {},

    // JavaScript linting. Configuration options are defined in .jshintrc
    jshint: {
      options: {
        jshintrc: true
      },
      grunt: {
        src: "Gruntfile.js"
      },
      source: {
        src: "src/**/*.js"
      }
    },

    // TODO
    //jsonlint: {},

    // TODO
    //spec

    // JavaScript minification for distribution files.
    uglify: {
      options: {
        mangle: false,
        preserveComments: "some"
      },
      basic: {
        src: "<%= concat.dist.dest %>",
        dest: "dist/<%= pkg.name %>.min.js"
      }
    },

    // Run grunt tasks when files change.
    watch: {
      src: {
        files: [
          "Gruntfile.js",
          "src/**/*.js"
        ],
        tasks: [
          "default"
        ]
      }
    }
  });

  // Load plugins from npm
  grunt.task.loadNpmTasks( "grunt-contrib-concat" );
  grunt.task.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.task.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.task.loadNpmTasks( "grunt-contrib-watch" );

  // Dev build
  grunt.task.registerTask( "default", [
    "jshint"
  ]);

  // Production ready build
  grunt.task.registerTask( "build", [
    "default",
    "concat",
    "uglify"
  ]);
};
