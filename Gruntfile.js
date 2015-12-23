module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assemble: {
      options: {partials: 'css/*.css'},
      templates: {
        src: 'templates/**/*.html',
        dest: 'build/downloads',
        cwd: './'
      },
      docsDev: {
        src: 'docs/examples/*.html',
        dest: 'build/docs',
        cwd: './'
      },
      docsDeploy: {
        src: 'docs/examples/*.html',
        dest: 'build',
        cwd: './'
      }
    },
    premailer: {
      simple:{
          files: [{
              expand: true,
              cwd: 'build/downloads/templates/',
              src: ['**/*.html'],
              dest: 'build/downloads/templates/inline'
          }]
      }
    },
    shell: {
      makeStage: {
        command: [
          'rm -rf build',
          'mkdir build',
          'mkdir build/downloads',
          'mkdir build/downloads/templates',
          'mkdir build/downloads/templates/inline',
          'mkdir build/downloads/framework',
          'mkdir build/docs',
        ].join('&&')
      },
      removeBase: {
        command: [
          'cd build/downloads/templates/base',
          'cp * ../',
          'cd ../',
          'rm -rf base'          
        ]
      },
      zipTemplates: {
        command: [
          'zip all-templates.zip *.html',
          'for i in *.html; do zip "${i%}.zip" "$i"; done',
          'cd ../../../'
        ].join('&&')
      },
      zipFramework: {
        command: [
          'cp css/ink.css build/downloads/framework/ink.css',
          'cp templates/boilerplate.html build/downloads/framework/boilerplate.html',
          'cp -r build/downloads/templates/examples build/downloads/framework/examples',
          'cd build/downloads/framework',
          'zip -r ink-<%= pkg.version %>.zip *',
          'cd ../../../',
        ].join('&&')
      },
      linkFramework: {
        command: [
          'cd build/downloads',
          'echo \'<?php $download_file = \"framework/ink-<%= pkg.version %>.zip\" ?>\' > latest.php',
          'cd ../../',
        ].join('&&')
      },
      deployDownloads: {
        command: [
          'cd build/downloads',
          'cd ../../'
        ].join('&&')
      },
      testDocs: {
        command: [
          'cp -r docs/test/* build/docs',
          'cp -r docs/components build/docs/components',
          'cp docs/docs.php build/docs/docs.php',
        ].join('&&')
      },
      deployDocs: {
        command: [
          'rsync -r docs build --exclude test --exclude examples',
          'cd build/docs',
          'cd ../../'
        ].join('&&')
      },
      cleanUp: {
        command: [
          'rm -rf build',
          'echo "Deploy Completed"'
        ].join('&&')
      }
    },
    sass: {
      dist: {
          options: {
            sourcemap: 'none'
          },
          files: [{
              expand: true,
              cwd: 'css/sass',
              src: ['*.scss'],
              dest: 'css/',
              ext: '.css'
          }]
      }
    },
    watch: {
      docs: {
        files: ['docs/docs.php', 'docs/**/*.php', 'docs/**/*.html', 'css/*.css'],
        tasks: ['shell:makeStage', 'assemble:docsDev', 'shell:testDocs'],
        options: {
          livereload: true,
        },
      },
      templates: {
        files: ['templates/**/*.html', 'css/*', 'css/**/*', 'css/**/**/*'],
        tasks: ['shell:makeStage', 'sass:dist', 'assemble:templates'],
        options: {
          livereload: true,
        },
      },
      inlineTemplates: {
        files: ['templates/**/*.html', 'css/*', 'css/**/*', 'css/**/**/*'],
        tasks: ['shell:makeStage', 'sass:dist', 'assemble:templates', 'premailer:simple'],
        options: {
          livereload: true,
        },
      }
    },
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-premailer');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('make:templates', ['sass:dist', 'assemble:templates', 'shell:zipTemplates']);
  grunt.registerTask('deploy:downloads', ['shell:makeStage', 'sass:dist','assemble:templates', 'premailer:simple', 'shell:zipTemplates', 'shell:linkFramework', 'shell:deployDownloads']);
  grunt.registerTask('default', ['shell:makeStage', 'sass:dist','assemble:templates', 'premailer:simple', 'shell:zipTemplates', 'shell:linkFramework', 'shell:deployDownloads']);
  grunt.registerTask('make:docs', ['shell:makeStage', 'assemble:docsDev', 'shell:testDocs']);
  grunt.registerTask('deploy:docs', ['shell:makeStage', 'assemble:docsDeploy', 'shell:deployDocs', 'shell:cleanUp']);
  // grunt.registerTask('default', ['watch:docs']);
  grunt.registerTask('dev', ['watch:templates']);
  grunt.registerTask('dev:inline', ['watch:inlineTemplates']);
};