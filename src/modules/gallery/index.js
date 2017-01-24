var Gallery = (function () {

    // Default links to images for slider.
    var _data = [
        './src/modules/gallery/images/1.jpg',
        './src/modules/gallery/images/2.jpg',
        './src/modules/gallery/images/3.jpg',
        './src/modules/gallery/images/4.jpg',
        './src/modules/gallery/images/5.jpg',
        './src/modules/gallery/images/6.jpg'
    ];

    /**
     * Default module's configuration.
     * @namespace
     * @property {Array} data - array of module's frames.
     */
    var _config = {
        data: _data
    };

    function _showFrame(src) {
        var galleryDisplayPic = document.querySelectorAll('.gallery__image_display')[0];
        galleryDisplayPic.src = src;
    }

    function _clickHandler(e) {
        e = e || window.event;

        var target = e.target || e.srcElement;

        if(target.tagName == 'IMG') {
            _showFrame(target.src);
        }
    }

    function _create() {
        var gallery = createElemWithClass('div', 'gallery');

        var galleryDisplay = createElemWithClass('div', 'gallery__display');

        var imageContainer = createElemWithClass('div', 'gallery__pics');

        var i = 0, images = _config.data, length = images.length;
        for(; i < length; i++) {
            var image = createElemWithClass('img', 'gallery__image');
            image.src = images[i];
            image.alt = 'Nature is beautiful.';

            imageContainer.appendChild(image);
        }

        var imageDisplay = imageContainer.firstChild.cloneNode(true);
        imageDisplay.className += ' gallery__image_display';

        galleryDisplay.appendChild(imageDisplay);

        gallery.appendChild(galleryDisplay);
        gallery.appendChild(imageContainer);

        imageContainer.onclick = _clickHandler;

        return gallery;
    }

    function init(config) {
        extend(_config, config);

        return _create();
    }

    return {
        init: init
    }

})();