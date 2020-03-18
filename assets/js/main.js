var $ = require('jquery');
var jqueryUI = require("jquery-ui");
require('bootstrap');

global.$ = global.jQuery = $;

$(document).ready(function() {
    // Check Loaded Libraries
    typeof $ == 'undefined' ? console.log('Warning: jQuery can\'t be loaded!') : '';
    typeof jqueryUI == 'undefined' ? console.log('Warning: jQueryUI can\'t be loaded!') : '';

    // Enable Popover
    $('[data-toggle="popover"]').popover();

    // Alert Box Fade-Out
    $('.alert').delay(14000).fadeOut(800);

    // Navbar Toggler Icon
    $('.collapse').on('shown.bs.collapse', function(e) {
        $('.navbar-toggler').find('.toggler').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    });

    $('.collapse').on('hidden.bs.collapse', function(e) {
        $('.navbar-toggler').find('.toggler').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });

    var body = document.querySelector('body');
    var navbar = document.querySelector('nav.navbar');
    body.className.match(new RegExp('(\\s|^)diary(\\s|$)')) ? navbar.classList.add("bg-secondary") : navbar.classList.add("bg-white");
});

// Sidebar
var fullHeight = function() {

    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function(){
        $('.js-fullheight').css('height', $(window).height());
    });

};
fullHeight();

$('#sidebarCollapse').on('click', function () {
  $('.sidebar.left').toggleClass('active');
});