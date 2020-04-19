/**
 * Essentials require
 */
var $ = require('jquery');
const axios = require('axios').default;
require('bootstrap');

global.$ = global.jQuery = $;

/**
 * Import class
 */
import LeftSidebar from './left-sidebar';
import RightSidebar from './right-sidebar';
import ActionsPage from './actions-page';
import Favorite from './favorite';

/**
 * Little bit of code
 */
$(document).ready(function() {
    // Check Loaded Libraries
    typeof $ == 'undefined' ? console.log('Warning: jQuery can\'t be loaded!') : '';
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

    const body      = document.querySelector('body');
    const navbar    = document.querySelector('nav.navbar');
    if(body && navbar) {
        body.className.match(new RegExp('(\\s|^)diary(\\s|$)')) ? navbar.classList.add("bg-secondary") : navbar.classList.add("bg-white");
    }

    /* Left Sidebar */
    const leftSidebar           = document.querySelector('.sidebar.left');
    const leftSidebarCollapse   = document.querySelector('.leftSidebarCollapse');
    const leftSidebarWidgets    = [].slice.call(document.querySelectorAll('li.left[data-type]'));
    const popup                 = document.querySelector('.orme.popup.choose');
    const popupClose            = document.querySelector('.popup__close.choose');
    const popupButtons          = [].slice.call(document.querySelectorAll('.popup__button.choose'));

    const rightListWidgets = [].slice.call(document.querySelectorAll('.sidebar.right .widgets__list'));

    if(leftSidebar && leftSidebarCollapse && leftSidebarWidgets && popup && popupClose && popupButtons && rightListWidgets) {
        new LeftSidebar(leftSidebar, leftSidebarCollapse, leftSidebarWidgets, popup, popupClose, popupButtons, rightListWidgets);

        const navigationArrows  = [].slice.call(document.querySelectorAll('.navigation__link'));
        const navigationInput   = document.querySelector('.navigation__input');
        const createPages       = document.querySelector('.create-page__link');
        const diaryLeftPage     = document.querySelector('.diary__bloc.left');
        const diaryRightPage    = document.querySelector('.diary__bloc.right');

        if(navigationArrows && navigationInput && createPages && diaryLeftPage && diaryRightPage) {
            new ActionsPage(navigationArrows, navigationInput, createPages, diaryLeftPage, diaryRightPage);
        }
    }

    /* Right Sidebar */
    const rightSidebar                  = document.querySelector('.sidebar.right');
    const rightSidebarCollapse          = document.querySelector('.rightSidebarCollapse');
    const divWidgets                    = document.querySelector('.sidebar.right > .widgets');
    const arrayTrash                    = [].slice.call(document.querySelectorAll('.trash'));
    const arrayEdit                     = [].slice.call(document.querySelectorAll('.modify'));
    const widgetsList                   = [].slice.call(document.querySelectorAll('.sidebar.right .widgets__items'));
    // Widget text
    const formContentRightSidebar       = document.querySelector('.sidebar.right div.widgets__form.text');
    const abandon                       = document.querySelector('.abandon.text');
    const persist                       = document.querySelector('.persist.text');
    // Widget Image
    const formContentImageRightSidebar  = document.querySelector('.sidebar.right div.widgets__form.image');
    const abandonImage                  = document.querySelector('.abandon.image');
    const persistImage                  = document.querySelector('.persist.image');
    // Widget Vidéo
    const formContentVideoRightSidebar  = document.querySelector('.sidebar.right div.widgets__form.video');
    const abandonVideo                  = document.querySelector('.abandon.video');
    const persistVideo                  = document.querySelector('.persist.video');

    if(rightSidebar && rightSidebarCollapse && divWidgets && arrayTrash && arrayEdit && widgetsList && formContentRightSidebar && abandon && persist && formContentImageRightSidebar && abandonImage && persistImage && formContentVideoRightSidebar && abandonVideo && persistVideo) {
        new RightSidebar(rightSidebar, rightSidebarCollapse, divWidgets, arrayTrash, arrayEdit, widgetsList, formContentRightSidebar, abandon, persist, formContentImageRightSidebar, abandonImage, persistImage, formContentVideoRightSidebar, abandonVideo, persistVideo);
    }

    /* Favoris */
    const favoritesBloc                 = document.querySelector('.diary__bloc.favorites');
    const favoritesSidebarList          = document.querySelector('.favorites__list');
    const favoritesAdd                  = document.querySelector('.favorites__add');
    const favoritesTrash                = [].slice.call(document.querySelectorAll('.favorites__trash'));
    const favoritesEdit                 = [].slice.call(document.querySelectorAll('.favorites__modify'));
    const favoritesPopup                = document.querySelector('.orme.popup.favorites');
    const favoritesPopupClose           = document.querySelector('.popup__close.favorites');
    const favoritesPopupChoices         = [].slice.call(document.querySelectorAll('.popup__icon'));

    if(favoritesBloc && favoritesSidebarList && favoritesAdd && favoritesEdit && favoritesTrash && favoritesPopup && favoritesPopupClose && favoritesPopupChoices) {
        new Favorite(favoritesBloc, favoritesSidebarList, favoritesAdd, favoritesEdit, favoritesTrash, favoritesPopup, favoritesPopupClose, favoritesPopupChoices);
    }
});