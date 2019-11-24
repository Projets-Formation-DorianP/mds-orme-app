var $ = require('jquery');

global.$ = global.jQuery = $;

$(document).ready(function() {
    $("#title").css('background-color', 'blue');
});