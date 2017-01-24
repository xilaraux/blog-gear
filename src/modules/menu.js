// Header menu events
var headerMenu = document.querySelectorAll('.header__nav')[0];

function _mouseOnHandler(e) {
    e = e || window.event;

    var target = e.target || e.srcElement;

    var tagName = target.nodeName;
    var listItem = null;
    var supMenu = null;
    var subMenu = null;

    if(tagName == "LI") {
        listItem = target;
    }

    if(tagName == 'A') {
        listItem = target.parentNode;
    }

    if(listItem) {
        supMenu = listItem.parentNode;
        subMenu = findChildNode(listItem, 'UL');
    }

    if(supMenu && supMenu.className.indexOf('header__nav_inner') != -1) {
        supMenu.className += ' opened';
    }

    if(subMenu) {
        subMenu.className += ' opened';
    }
}

function _mouseOutHandler(e) {
    e = e || window.event;

    var target = e.target || e.srcElement;

    var tagName = target.nodeName;
    var listItem = null;
    var subMenu = null;
    var supMenu = null;

    if(tagName == "LI") {
        listItem = target;
    }

    if(tagName == 'A') {
        listItem = target.parentNode;
    }

    if(listItem) {
        supMenu = listItem.parentNode;
        subMenu = findChildNode(listItem, 'UL');
    }

    if(supMenu && supMenu.className.indexOf('header__nav_inner') != -1) {
        // setTimeout(function () {
        removeClass(supMenu, 'opened')
        // }, 1000);
    }

    if(subMenu) {
        // setTimeout(function () {
        removeClass(subMenu, 'opened')
        // }, 1000);
    }
}

if(headerMenu) {
    addEventListener(headerMenu, 'mouseover', _mouseOnHandler);
    addEventListener(headerMenu, 'mouseout', _mouseOutHandler);
}