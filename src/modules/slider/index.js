/**
 * A module which provides slider.
 * @module slider
 */
;(function (window) {

    // Default links to images for slider.
    var _data = [
        './src/modules/slider/images/1.jpg',
        './src/modules/slider/images/2.jpg',
        './src/modules/slider/images/3.jpg',
        './src/modules/slider/images/4.jpg',
        './src/modules/slider/images/5.jpg',
        './src/modules/slider/images/6.jpg'
    ];

    /**
     * @description Default module's configuration.
     * @namespace _config
     * @property {number} interval - interval for switching current slider's frame.
     * @property {Array} data - array of module's frames.
     */
    var _config = {
        interval: 5000,
        data: _data,
    };

    // Slider essence
    var _SLIDER = null;

    // Current frame of the slider.
    var _frame = 0;

    /**
     * @description Displaying slider's frame.
     * @param {number} index - number of the frame
     * @private
     */
    function _showFrame(index) {
        var images = document.querySelectorAll('.slider__image');
        var items = document.querySelectorAll('.slider__item');

        if(index >= images.length) {
            index = 0;
        }

        if(index < 0) {
            index = images.length - 1;
        }

        for(var i = 0, length = images.length; i < length; i++) {
            images[i].style.display = 'none';
        }

        _frame = index;

        for(var i = 0, length = items.length; i < length; i++) {
            items[i].className = items[i].className.replace(" slider__item_active", "")
        }

        items[_frame].className += " slider__item_active";
        images[_frame].style.display = 'block';
    }

    /**
     * @description Change current frame to the next one.
     * @function _moveNext
     * @private
     */
    function _moveNext() {
        _showFrame(++_frame);
    }

    /**
     * @description Change current frame to the previous one.
     * @function _movePrev
     * @private
     */
    function _movePrev() {
        _showFrame(--_frame);
    }

    /**
     * @description Hendler for slider panel.
     * @param {object} e - event object
     * @private
     */
    function _panelClickHandler(e) {
        e = e || window.event;

        var target = e.target || e.srcElement;

        var dataIndex = target.getAttribute('data-index');
        // Handling click on the dots.
        if(!!dataIndex) {
            _showFrame(dataIndex);
        }

        var className = target.className;
        // Handling click on prev arrow.
        if(className.indexOf('slider__prev') >= 0) {
            _movePrev();
        }

        // Handling click on next arrow.
        if(className.indexOf('slider__next') >= 0) {
            _moveNext();
        }
    }

    /**
     * @description Load slider markup and other staff.
     * @function _create
     * @return {object} DOM object of the module
     */
    function _create() {
        // Prevent re-creation
        if(_SLIDER) {
            return _SLIDER; // FIX: doesn't create element at second time in IE8. Maybe have to create copy
        }

        var imagesArray = [];
        var i = 0, length = _config.data.length;
        for(; i < length; i++) {
            var image = createElementByObject({
                tagName: 'img',
                className: 'slider__image',
                src: _config.data[i]
            });

            imagesArray.push(image);
        }

        // Panel items
        var panelItems = [];

        var prevButton = createElementByObject({
            tagName: 'span',
            className: 'slider__prev',
            innerHTML: '&#10094;'
        });
        panelItems.push(prevButton);

        for(var i = 0; i < length; i++) {
            var panelItem = createElementByObject({
                tagName: 'span',
                className: 'slider__item',
                innerHTML: '' + i
            });
            panelItem.setAttribute('data-index', i);

            panelItems.push(panelItem);
        }

        var nextButton = createElementByObject({
            tagName: 'span',
            className: 'slider__next',
            innerHTML: '&#10095;'
        });
        panelItems.push(nextButton);

        // Slider interface
        var panel = createElementByObject({
            tagName: 'div',
            className: 'slider__panel',
            onclick: _panelClickHandler,
            children: panelItems
        });

        imagesArray.push(panel);

        // Slider
        var slider = createElementByObject({
            tagName: 'div',
            className: 'slider',
            children: imagesArray
        });

        _SLIDER = slider;
        return slider;
    }

    /**
     * @description It provides events for auto switching picture and displaying current frame.
     * @method start
     */
    function start() {
        // FIX: error after come back on the page
        _showFrame(_frame);

        var interval = setInterval(function() {
            if(document.querySelectorAll('.slider')[0]) {
                _moveNext();
            } else {
                clearInterval(interval);
            }
        }, _config.interval);
    }

    /**
     * @description Initial function for module
     * @method init
     * @param {object} config - configurations object.
     * @return {object} DOM object of the module.
     */
    function init(config) {
        extend(_config, config);

        return _create();
    }

    window.Slider = {
        init: init,
        start: start,
    };

}(window));