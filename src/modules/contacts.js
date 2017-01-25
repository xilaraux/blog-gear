;(function (window) {
    var _data = {
        name: 'Alexander Kozlov',
        phone: '+380660137641',
        email: 'alxnder.kozlov@gmail.com',
        address: 'вулиця Академіка Янгеля, 16/2',
    };

    var _script = null;

    var _config = {
        data: _data,
        mapSrc: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCtCaWLqR1hwcGlesMkFotNT2aS7x0fFv4',
    };

    function _initMap() {
        var map = new google.maps.Map(document.querySelectorAll('.contacts__map')[0], {
            zoom: 15,
            center: {lat: 50.449081, lng: 30.452632},
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
        });

        var latlng = (new google.maps.Geocoder())
            .geocode({'address': _config.data.address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
    }

    function _create() {
        var data = _config.data;

        var map = createElemWithClass('div', 'contacts__map');
        map.style.position = 'fixed';

        var contacts = createElementByObject({
            tagName: 'div',
            className: 'contacts',
            children: [
                {
                    tagName: 'div',
                    className: 'contacts__details',
                    children: [
                        {
                            tagName: 'p',
                            className: 'contacts__text',
                            innerHTML: data.name
                        },
                        {
                            tagName: 'p',
                            className: 'contacts__text',
                            innerHTML: '<a href="tel:' + data.phone + '" class="contacts__link">' + data.phone + '<\/a>'
                        },
                        {
                            tagName: 'p',
                            className: 'contacts__text',
                            innerHTML: '<a href="tel:' + data.email + '" class="contacts__link">' + data.email + '<\/a>'
                        }
                    ]
                },
                map
            ]
        });

        return contacts;
    }

    function start() {
        if(_script) {
            _initMap();
            return;
        }

        var body = document.getElementsByTagName('body')[0];

        var moduleScript = createElementByObject({
            tagName: 'script',
            type: 'text/javascript',
            src: _config.mapSrc,
            onload: _initMap
        });

        _script = moduleScript;
        // add script at the end of the tag
        body.appendChild(moduleScript);
    }

    function init(config) {
        extend(_config, config);

        return _create();
    }

    window.Contacts = {
        init: init,
        start: start,
    };

}(window));