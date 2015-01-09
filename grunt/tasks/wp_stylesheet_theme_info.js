module.exports = function (grunt) {

    var fs = require('fs'),
        FileSection = require(__dirname + '/../lib/file-section');

    grunt.registerTask('wp_stylesheet_theme_info', "Defines the theme in style.css", function () {


        var options = this.options({
            marker: {
                start: '/*! ---HelperPress Theme Config Start---',
                end: '---HelperPress Theme Config End--- */',
            },
            tabString: '\t'
        });
        
        if(!options.filename){
            return grunt.log.write('Path to stylesheet source not provided, skipping automatic theme definition.');
        }

        var newLines = [],
            themeConfig = grunt.config('helperpress.wp.theme'),

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
                        var pkgAuthor = grunt.config('pkg.author'),
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
                        var pkgAuthor = grunt.config('pkg.author'),
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
                        return grunt.config('pkg.description');
                    }
                },
                version: {
                    wpKey: 'Version',
                    default: function(){
                        return grunt.config('pkg.version');
                    }
                },
                license: {
                    wpKey: 'License',
                    default: function(){
                        return grunt.config('pkg.license');
                    }
                },
                license_uri: {
                    wpKey: 'License URI',
                    default: function(){
                        return 'http://lmgtfy.com/?q=' + encodeURIComponent( grunt.config('pkg.license') );
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

            newLines.push(line);
        }
        
        var styleCss = new FileSection({  
                filename: options.filename,
                marker: options.marker,
            });

        styleCss.write( newLines );

    });

};