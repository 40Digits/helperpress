var _ = require('lodash'),
    fs = require('fs');

var FileSection = function( options ){

    var defaults = {
        filename: '',
        marker: {
            start: '<start section delineator string here>',
            end: '<end section delineator string here>'
        },
        encoding: 'utf8'
    };

    this.options = _.extend(defaults, options);
    this.read();

};

FileSection.prototype.read = function() {
    var thisFS = this;

    this.fileContents = [];
    this.startLine = 0;
    this.content = [];
    this.endLine = 0;

    if (!fs.existsSync( this.options.filename ) ) {
        return false;
    }

    this.fileContents = fs.readFileSync(this.options.filename, { encoding: this.options.encoding }).split('\n');

    var inSection = false;
    this.fileContents
        .forEach(function (line, i) {
            if (line.indexOf(thisFS.options.marker.end) !== -1){
                inSection = false;
                thisFS.endLine = i;
            }

            if ( inSection ){
                thisFS.content.push(line);
            }

            if (line.indexOf(thisFS.options.marker.start) !== -1){
                inSection = true;
                thisFS.startLine = i;
            }
        });

    this.length = thisFS.endLine - thisFS.startLine + 1; // plus one since it's 0-index

    //make sure it stays 0 if it's really 0
    if(this.length === 1){
        this.length = 0;
    }

    return this;
};

FileSection.prototype.write = function( newLines, pos ) {

    // add markers
    newLines.unshift(this.options.marker.start);
    newLines.push(this.options.marker.end);
    
    // if it's already there, remove it
    if(this.length > 0){
        this.fileContents.splice(this.startLine, this.length + 2);
    }


    // insert it
    if(pos === 'end'){
        this.fileContents = this.fileContents.concat(newLines);
    } else {
        // must be start
        this.fileContents = newLines.concat(this.fileContents);
    }

    // write it
    fs.writeFileSync( this.options.filename, this.fileContents.join('\n') );

    return this;
}

module.exports = FileSection