const minify = require('@node-minify/core');
const uglifyJS = require('@node-minify/uglify-js');

minify({
    compressor: uglifyJS,
    input: 'script.js',
    output: 'index.js',
    callback: function(err, min) {}
});