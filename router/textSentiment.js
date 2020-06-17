var fs = require('fs');
const path = require('path');

exports.getCode = function () {
    let textPath = path.join(__dirname + '/text_js.js');
    return fs.readFileSync(textPath, 'utf8');
}