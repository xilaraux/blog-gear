function removeClass(obj, cls) {
    var classes = obj.className.split(' ');

    for (var i = 0; i < classes.length; i++) {
        if (classes[i] == cls) {
            classes.splice(i, 1);
            i--;
        }
    }
    obj.className = classes.join(' ');

}

function findChildNode(parent, tagName) {
    var childs = parent.childNodes;

    for(var i = 0, length = childs.length; i < length; i++) {
        if(childs[i].tagName == tagName) {
            return childs[i];
        }
    }

    return null;
}

function createElemWithClass(elementName, className) {
    if(!elementName)
        return null;

    var element = document.createElement(elementName);
    element.className = className ? className : "";

    return element;
}

function addEventListener(element, event, callback) {
    // Check parameters
    if(!element || !event || !callback) {
        return;
    }

    // Add event on the element
    if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    }
    else {
        event = 'on' + event;
        element.attachEvent(event, callback);
    }
}

function getHashFromURL(URL) {
    var route = URL.split('#')[1] ? URL.split('#')[1] : '/';

    return route;
}

// Extend object function
function extend(target, firstSource) {
    'use strict';
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    for(var value in firstSource) {
        target[value] = firstSource[value];
    }
}

// Object should contain this fields:
// { tagName, [className, innerHTML, children] }
// children is array of tags which will be included after innerHTML
function createElementByObject(object) {
    var element = createElemWithClass(object.tagName, object.className);

    if(object.innerHTML) {
        element.innerHTML = object.innerHTML;
    }

    if(object.id) {
        element.id = object.id;
    }

    // For images
    if(object.src) {
        element.src = object.src;
    }
    if(object.alt) {
        element.alt = object.alt;
    }

    // For inputs
    if(object.placeholder) {
        element.placeholder = object.placeholder;
    }
    if(object.value) {
        element.value = object.value;
    }
    if(object.disabled) {
        element.disabled = true;
    }
    // IE8 doesn't support this progressive thing
    if(object.type) {
        element.type = object.type;
    }

    // For links
    if(object.href) {
        element.href = object.href;
    }

    // Events
    if(object.onsubmit) {
        element.onsubmit = object.onsubmit;
    }
    if(object.onclick) {
        element.onclick = object.onclick;
    }
    if(object.onload) {
        element.onload = object.onload;
    }

    if(!object.children)
        return element;

    for(var i = 0, length = object.children.length; i < length; i++) {
        element.appendChild(createElementByObject(object.children[i]));
    }

    return element;
}

// Simple example of usage:
// document.body.appendChild(createElementByObject({
//     tagName: 'div',
//     className: 'someClassName',
//     innerHTML: 'some text',
//     children: [
//         {
//             tagName: 'div',
//             className: 'someClassName',
//             innerHTML: 'some 1',
//         },
//         {
//             tagName: 'div',
//             className: 'someClassName',
//             innerHTML: 'some 2',
//         },
//         {
//             tagName: 'div',
//             className: 'someClassName',
//             innerHTML: 'some 3',
//             children: [
//                 {
//                     tagName: 'div',
//                     className: 'someClassName',
//                     innerHTML: 'some 1',
//                 },
//                 {
//                     tagName: 'div',
//                     className: 'someClassName',
//                     innerHTML: 'some 2',
//                     children: [
//                         {
//                             tagName: 'div',
//                             className: 'someClassName',
//                             innerHTML: 'some 1',
//                         },
//                         {
//                             tagName: 'div',
//                             className: 'someClassName',
//                             innerHTML: 'some 2',
//                         }
//                     ]
//                 }
//             ]
//         }
//     ],
// }));