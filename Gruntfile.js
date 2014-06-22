module.exports = function( grunt ) {
  var _ = require( "underscore" );
  _.str = require( "underscore.string" );

  grunt.config.init({
    // Expose underscore to the template processor.
    _: _,

    pkg: grunt.file.readJSON( "package.json" ),

    // Version management
    bump: {
      options: {
        commitFiles: [
          "dist/*",
          "bower.json",
          "package.json"
        ],
        files: [
          "bower.json",
          "package.json"
        ],
        pushTo: "origin master",
        tagName: "%VERSION%",
        updateConfigs: [ "pkg" ]
      }
    },

    // Concatenates build and source files into a single file.
    concat: {
      options: {
        process: true
      },
      dist: {
        src: [
          "build/start.jst",
          "src/<%= pkg.name %>.js",
          "build/end.jst"
        ],
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
      dist: {
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
  grunt.loadNpmTasks( "grunt-bump" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );

  // Dev build
  grunt.registerTask( "default", [
    "jshint"
  ]);

  // Full build
  grunt.registerTask( "build", [
    "default",
    "concat",
    "uglify"
  ]);

  // Production release
  grunt.registerTask( "release", function() {
    var type = this.args.shift() || "patch";
    grunt.task.run( [
      "bump:" + type + ":bump-only",
      "build",
      "bump:" + type + ":commit-only"
    ] );
  });
};
