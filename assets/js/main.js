var $ = require('jquery');
var jqueryUI = require("jquery-ui");

global.$ = global.jQuery = $;

$(document).ready(function() {
    if (typeof jqueryUI != 'undefined') {
        console.log("1");
    }
});