/**
 * Essentials require
 */
var $ = require('jquery');
var jqueryUI = require("jquery-ui");
const axios = require('axios').default;
require('bootstrap');

global.$ = global.jQuery = $;

/**
 * Import class
 */
import LeftSidebar from './left-sidebar';
import RightSidebar from './right-sidebar';

/**
 * Little bit of code
 */
$(document).ready(function() {
    // Check Loaded Libraries
    typeof $ == 'undefined' ? console.log('Warning: jQuery can\'t be loaded!') : '';
    typeof jqueryUI == 'undefined' ? console.log('Warning: jQueryUI can\'t be loaded!') : '';
    typeof axios == 'undefined' ? console.log('Warning: axios can\'t be loaded!') : '';

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

    const body = document.querySelector('body');
    const navbar = document.querySelector('nav.navbar');
    if(body && navbar) {
        body.className.match(new RegExp('(\\s|^)diary(\\s|$)')) ? navbar.classList.add("bg-secondary") : navbar.classList.add("bg-white");
    }

    /* Left Sidebar */
    const leftSidebar = document.querySelector('.sidebar.left');
    const leftSidebarCollapse = document.querySelector('.leftSidebarCollapse');
    const leftSidebarWidgets = [].slice.call(document.querySelectorAll('li.left[data-type]'));
    const popup = document.querySelector('.orme.popup');
    const popupClose = document.querySelector('.popup__close');
    const popupButtons = [].slice.call(document.querySelectorAll('.popup__button'));

    const rightListWidgets = [].slice.call(document.querySelectorAll('.sidebar.right .widgets__list'));

    if(leftSidebar && leftSidebarCollapse && leftSidebarWidgets && popup && popupClose && popupButtons && rightListWidgets) {
        new LeftSidebar(leftSidebar, leftSidebarCollapse, leftSidebarWidgets, popup, popupClose, popupButtons, rightListWidgets);
    }
    

    /* Right Sidebar */
    const rightSidebar = document.querySelector('.sidebar.right');
    const rightSidebarCollapse = document.querySelector('.rightSidebarCollapse');
    const divWidgets = document.querySelector('.sidebar.right > .widgets');
    const arrayTrash = [].slice.call(document.querySelectorAll('.trash'));

    if(rightSidebar && rightSidebarCollapse && divWidgets && arrayTrash) {
        new RightSidebar(rightSidebar, rightSidebarCollapse, divWidgets, arrayTrash);
    }
});