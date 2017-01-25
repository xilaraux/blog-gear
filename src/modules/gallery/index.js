;(function (window) {

    // Default links to images for slider.
    var _data = [
        './src/modules/gallery/images/1.jpg',
        './src/modules/gallery/images/2.jpg',
        './src/modules/gallery/images/3.jpg',
        './src/modules/gallery/images/4.jpg',
        './src/modules/gallery/images/5.jpg',
        './src/modules/gallery/images/6.jpg'
    ];

    // FIX: events doesn't work
    var _GALLERY = null;

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
        // Prevent re-creation
        if(_GALLERY) {
            return _GALLERY.cloneNode(true);
        }

        var imageContainer = [];
        var i = 0, images = _config.data, length = images.length;
        for(; i < length; i++) {
            var image = createElementByObject({
                tagName: 'img',
                className: 'gallery__image',
                src: images[i],
                alt: 'Nature is beautiful.'
            });

            imageContainer.push(image);
        }

        var gallery = createElementByObject({
            tagName: 'div',
            className: 'gallery',
            children: [
                {
                    tagName: 'div',
                    className: 'gallery__display',
                    children: [
                        {
                            tagName: 'img',
                            className: 'gallery__image gallery__image_display',
                            src: images[0],
                            alt: 'Nature is beautiful.'
                        } 
                    ]
                },
                {
                    tagName: 'div',
                    className: 'gallery__pics',
                    onclick: _clickHandler,
                    children: imageContainer
                }
            ]
        });

        _GALLERY = gallery;
        return gallery;
    }

    function init(config) {
        extend(_config, config);

        return _create();
    }

    window.Gallery = {
        init: init
    };

}(window));