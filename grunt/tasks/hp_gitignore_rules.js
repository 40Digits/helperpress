module.exports = function (grunt) {

    var FileSection = require(__dirname + '/../lib/file-section');

    grunt.registerTask('hp_gitignore_rules', "Defines HelperPress-specific gitignore rules", function () {

        var options = this.options({
            marker: {
                start: '#### BEGIN HelperPress Rules ####',
                end: '#### END HelperPress Rules ####',
            }
        });
        
        if(!options.filename){
            return grunt.hpLog.write('Path to .gitignore not provided.');
        }

        
        var templateStr = grunt.file.read(__dirname + '/../templates/helperpress-gitignore'),
            templateLines = templateStr.split("\n"),
            repoGitignore = new FileSection({  
                filename: options.filename,
                marker: options.marker
            });


        repoGitignore.write( templateLines, 'end' );

    });

};