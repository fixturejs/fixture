/* jshint camelcase: false */
module.exports = function(grunt) {
  var _ = require("underscore");
  _.str = require("underscore.string");

  grunt.config.init({
    // Expose underscore to the template processor.
    _: _,

    // Front-end dependency management
    bowercopy: {
      vendor: {
        options: {
          destPrefix: "vendor"
        },
        files: {
          "require.js": "requirejs/require.js"
        }
      }
    },

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
        updateConfigs: [
          "pkg"
        ]
      }
    },

    // Clean up files and folders before build
    clean: {
      dependencies: [
        "bower_components",
        "vendor"
      ],
      build: [
        "dist"
      ]
    },

    // Unit testing
    jasmine: {
      taskName: {
        src: "src/**/*.js",
        options: {
          outfile: "spec/runner.html",
          specs: "spec/*.js",
          template: require("grunt-template-jasmine-requirejs"),
          templateOptions: {
            requireConfigFile: "build/config.js"
          }
        }
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

    pkg: grunt.file.readJSON("package.json"),

    // TODO
    //spec

    // Require.js optimization. Processes multiple AMD compliant files into one.
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "build/config.js",
          name: "build/main.js",
          optimize: "none",
          out: "dist/fixture.js",
          skipModuleInsertion: true,
          skipSemiColonInsertion: true,
          wrap: {
            start: "<%= templates.banner %><%= templates.start %>",
            end: "<%= templates.end %>"
          }
        }
      }
    },

    // Remove development-only code segments
    strip_code: {
      build: {
        options: {
          start_comment: "start-build-ignore",
          end_comment: "end-build-ignore"
        },
        src: "dist/fixture.js"
      }
    },

    // Build templates
    templates: {
      banner: grunt.file.read("build/banner.jst"),
      end: grunt.file.read("build/end.jst"),
      start: grunt.file.read("build/start.jst")
    },

    // JavaScript minification for distribution files.
    uglify: {
      options: {
        banner: "<%= templates.banner %>",
        preserveComments: false
      },
      dist: {
        src: "<%= requirejs.compile.options.out %>",
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
  grunt.loadNpmTasks("grunt-bowercopy");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-strip-code");

  // Dev testing
  grunt.registerTask("test", [
    "jshint",
    "clean:dependencies",
    "bowercopy",
    "jasmine"
  ]);

  // Build
  grunt.registerTask("build", [
    "default",
    "clean:build",
    "requirejs",
    "strip_code",
    "uglify"
  ]);

  // Release
  grunt.registerTask("release", function() {
    var type = this.args.shift() || "patch";
    grunt.task.run([
      "bump:" + type + ":bump-only",
      "build",
      "bump:" + type + ":commit-only"
    ]);
  });

  // Default task
  grunt.registerTask("default", "test");
};
