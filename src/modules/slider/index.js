/**
 * A module which provides slider.
 * @module slider
 */
var Slider = (function () {

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
     * @function _render
     * @return {object} DOM object of the module
     */
    function _render() {

        var slider = createElemWithClass('div', 'slider');

        var i = 0, length = _config.data.length;
        for(; i < length; i++) {
            var image = createElemWithClass('img', 'slider__image');

            image.src = _config.data[i];

            slider.appendChild(image);
        }

        var panel = createElemWithClass('div', 'slider__panel');

        var prevItem = createElemWithClass('span', 'slider__prev');
        prevItem.innerHTML = '&#10094;';

        panel.appendChild(prevItem);

        for(i = 0; i < length; i++) {
            var panelItem = createElemWithClass('span', 'slider__item');

            panelItem.setAttribute('data-index', i);

            panelItem.innerHTML = i;

            panel.appendChild(panelItem);
        }

        var nextItem = createElemWithClass('span', 'slider__next');
        nextItem.innerHTML = '&#10095;';

        panel.appendChild(nextItem);

        slider.appendChild(panel);

        panel.onclick = _panelClickHandler;

        return slider;
    }

    /**
     * @description It provides events for auto switching picture and displaying current frame.
     * @method start
     */
    function start() {
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

        return _render();
    }

    return {
        init: init,
        start: start,
    };

}());