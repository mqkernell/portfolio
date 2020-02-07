module.exports = function(grunt) {

  var _ = require('lodash');

  let imgSizes = [1200, 680, 320, 16]; 
  let sharpTasksArray = imgSizes.map(size => {
    return {resize: size, rename: `{base}-x${size}.{ext}`};
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['public/assets'],
    sharp: {
      apple: {
        files: [{
          expand: true,
          cwd: 'assets/',
          src: ['**/*.{jpg,jpeg,png}'],
          dest: 'public/assets/'
        }],
        options: {
          tasks: sharpTasksArray,
        }
      }
    },
    folder_list : {
      options : {
        files:  true,
        folders: false
      },
      files : {
        src  : ['public/**/*'],
        dest : 'imgdata.json',
      }
    },
  });

  grunt.registerTask('format-img-data', 'format the image data', function() {
    let data = grunt.file.readJSON('imgdata.json');
    let projects = {}

    data.forEach(file => {
      if(file.location && file.location.split('/')) {
        let projectFolder = file.location.split('/')[2];
        let fileBaseName  = file.filename.split('-x')[0];
        let fileBaseSrc   = file.location.split('-x')[0];
        let thumbSize     = imgSizes.sort((a,b) => a - b)[0];
        let fileSrcset    = imgSizes.map(size => {
          return `${fileBaseSrc}-x${size}.${file.filetype} ${size}w`;
        }).join(', '); 


        // If the project folder does not contain the filename
        if(projects[projectFolder]) {
          if(projects[projectFolder]) {
            projects[projectFolder].push({
              name: fileBaseName,
              src: `${fileBaseSrc}.${file.filetype}`,
              srcset: fileSrcset,    
              thumb: `${fileBaseSrc}-x${thumbSize}.${file.filetype}`       
            })
          }
        } else {
          projects[projectFolder] = [{
            name: fileBaseName,
            src: `${fileBaseSrc}.${file.filetype}`,
            srcset: fileSrcset, 
            thumb: `${fileBaseSrc}-x${thumbSize}.${file.filetype}`       
          }]
        }
      }
    })

    // Remove duplicate images
    for(let project in projects) {
      projects[project] = _.uniqBy(projects[project], 'name'); 
    }

    grunt.file.write('project-images.js', 'var projectImages = ' + JSON.stringify(projects));
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sharp');
  grunt.loadNpmTasks('grunt-folder-list');


  // Default task(s).
  grunt.registerTask('default', ['clean', 'sharp', 'folder_list', 'format-img-data']);

};