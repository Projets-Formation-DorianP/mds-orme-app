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

// Alert Box Fade-Out
$(document).ready(function() {
    $('.alert').delay(14000).fadeOut(800);
});

// Navbar Toggler Icon
$(document).ready(function() {

    $('.collapse').on('shown.bs.collapse', function(e) {
        $('.navbar-toggler').find('.toggler').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    });

    $('.collapse').on('hidden.bs.collapse', function(e) {
        $('.navbar-toggler').find('.toggler').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });
});