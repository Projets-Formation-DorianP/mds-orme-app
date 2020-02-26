var $ = require('jquery');
var jqueryUI = require("jquery-ui");
require('bootstrap');

global.$ = global.jQuery = $;

// Check Loaded Libraries
$(document).ready(function() {
    if (typeof $ == 'undefined')
        console.log('Warning: jQuery can\'t be loaded!');
    if (typeof jqueryUI == 'undefined')
        console.log('Warning: jQueryUI can\'t be loaded!');
});

// Enable Popover
$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

// Alert Fade-Out
$(document).ready(function() {
    $('.alert').delay(14000).fadeOut(800);
});
