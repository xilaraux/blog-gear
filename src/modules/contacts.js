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

        var contacts = createElemWithClass('div', 'contacts');

        var map = createElemWithClass('div', 'contacts__map');
        map.style.position = 'fixed';

        var details = createElemWithClass('div', 'contacts__details');

        var name = createElemWithClass('p', 'contacts__text');
        name.innerHTML = data.name;

        var phone = createElemWithClass('p', 'contacts__text');
        phone.innerHTML = '<a href="tel:' + data.phone + '" class="contacts__link">' + data.phone + '<\/a>';

        var email = createElemWithClass('p', 'contacts__text');
        email.innerHTML = '<a href="tel:' + data.email + '" class="contacts__link">' + data.email + '<\/a>';

        details.appendChild(name);
        details.appendChild(phone);
        details.appendChild(email);

        contacts.appendChild(details);
        contacts.appendChild(map);

        return contacts;
    }

    function start() {
        if(_script) {
            _initMap();
            return;
        }

        var body = document.getElementsByTagName('body')[0];

        var moduleScript = document.createElement('script');
        moduleScript.type = 'text/javascript';
        moduleScript.src = _config.mapSrc;

        _script = moduleScript;

        moduleScript.onload = _initMap;
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