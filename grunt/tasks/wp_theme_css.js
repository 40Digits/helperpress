module.exports = function (grunt) {

    var fs = require('fs');


    // the following is converted from WordPress' .htaccess read/writer
    // inside wp-admin/includes/misc.php
    ////////////////////////////////////////////////////////////////////

    function getCurMarkers( filename, marker ) {
        var result = {
                startLine: 0,
                content: [],
                endLine: 0
            },
            state = false,

            endLine, startLine, curFile;

        if (!fs.existsSync( filename ) ) {
            return false;
        }

        curFile = fs.readFileSync(filename, { encoding: 'utf8' });

        curFile.split("\n").forEach(function (line, i) {
            if (line.indexOf(marker.end) !== -1){
                state = false;
                result.endLine = i;
            }

            if ( state ){
                result.content.push(line);
            }

            if (line.indexOf(marker.begin) !== -1){
                state = true;
                result.startLine = i;
            }
        });

        return result;
    }

    function insertMarkers( filename, marker, insertion, pos ) {

        var curContents = fs.readFileSync(filename, { encoding: 'utf8' }).split("\n"),
            foundit = false,
            newContents;

        // add markers
        insertion.unshift(marker.start);
        insertion.push(marker.end);
        
        // see if it's already there. if so, remove it
        var curMarkerInfo = getCurMarkers( filename, marker ),
            len = curMarkerInfo.endLine - curMarkerInfo.startLine + 1; // plus one since it's 0-index

        curContents.splice(curMarkerInfo.startLine, len);

        // insert it
        if(pos === "end"){
            newContents = curContents.concat(insertion);
        } else {
            // must be start
            newContents = insertion.concat(curContents);
        }

        // write it
        fs.writeFileSync( filename, newContents.join("\n") );

        return true;
    }

    grunt.registerTask('wp_theme_css', "Defines the theme in style.css", function () {

        var options = this.options({
            marker: {
                start: '/*! ---HelperPress Theme Config Start---',
                end: '// ---HelperPress Theme Config End---',
            },
            tabString: '\t'
        });

        var definitionLines = [],
            themeConfig = grunt.config.process('<%= pkg.config.wp.theme %>'),

            keyMap = {
                name: {
                    wpKey: 'Theme Name'
                },
                uri: {
                    wpKey: 'Theme URI'
                },
                author: {
                    wpKey: 'Author',
                    default: function(){
                        var pkgAuthor = grunt.config.process('<%= pkg.author %>'),
                            emailPos = pkgAuthor.indexOf('<'),
                            urlPos = pkgAuthor.indexOf('('),

                            endPos;

                            if( emailPos > -1 ){
                                endPos = emailPos;
                            } else if( urlPos > -1 ){
                                endPos = urlPos;
                            } else {
                                endPos = pkgAuthor.length
                            }

                        return pkgAuthor.substring( 0, endPos );
                    }
                },
                author_uri: {
                    wpKey: 'Author URI',
                    default: function(){
                        var pkgAuthor = grunt.config.process('<%= pkg.author %>'),
                            urlPos = pkgAuthor.indexOf('('),
                            urlEndPos = pkgAuthor.indexOf(')');

                            if( urlPos === -1 ){
                                return '';
                            }

                        return pkgAuthor.substring( urlPos + 1, urlEndPos );
                    }
                },
                description: {
                    wpKey: 'Description',
                    default: function(){
                        return grunt.config.process('<%= pkg.description %>');
                    }
                },
                version: {
                    wpKey: 'Version',
                    default: function(){
                        return grunt.config.process('<%= pkg.version %>');
                    }
                },
                license: {
                    wpKey: 'License',
                    default: function(){
                        return grunt.config.process('<%= pkg.license %>');
                    }
                },
                license_uri: {
                    wpKey: 'License URI',
                    default: function(){
                        return 'http://lmgtfy.com/?q=' + encodeURIComponent( grunt.config.process('<%= pkg.license %>') );
                    }
                },
                tags: {
                    wpKey: 'Tags'
                },
                slug: {
                    wpKey: 'Text Domain'
                }
            };

        for(var key in keyMap){

            var line = options.tabString + keyMap[key].wpKey + ': ';

            if( typeof themeConfig[key] === 'string' && themeConfig[key].length > 0 ){
                line += themeConfig[key];
            } else if( typeof keyMap[key].default === 'function' ) {
                line += keyMap[key].default();
            } else {
                continue;
            }

            definitionLines.push(line);
        }

        console.log(themeConfig);

        insertMarkers( options.sass, options.marker, definitionLines );

    });

};