// Routes
;(function (window) {
    var _routes = {
        '/404': {
            title: 'ERROR 404',
            action: function() {
                var contentBlock = document.querySelectorAll('.content')[0];

                if(!contentBlock) {
                    contentBlock = createElemWithClass('div', 'content');
                }

                var error = createElemWithClass('div', 'error error_404');

                var errorMessage = createElemWithClass('p', 'error__message');
                errorMessage.innerHTML = 'ERROR 404';

                error.appendChild(errorMessage);

                contentBlock.innerHTML = '';
                contentBlock.appendChild(error);
            },
        },
    };

    function addRoute(path, title, callback) {
        _routes[path] = {};
        _routes[path].title = title;
        _routes[path].action = callback;
    }

    function removeRoute(path) {
        var route = _routes[path];

        if(!route) {
            return false;
        }

        delete _routes[path];
        return true;
    }

    function loadRoute(path) {
        path = getHashFromURL(path);

        // Manage difficult routes like /blog/category/post and compare it with template route /blog/*
        var cutPath = path.split('/');
        if(cutPath.length >= 3) {
            var template = '/' + cutPath[1] + '/*';

            var temporaryRoute = _routes[template];
            if(temporaryRoute) {
                temporaryRoute.action();
            }
        }

        // Delay have to be because of possibility dynamically added routes.
        setTimeout(function () {
            var route = _routes[path];

            if(!route) {
                path = '/404';
                route = _routes[path];
            }

            route.action();
            document.title = route.title;
            window.location.hash = path;
            return path;
        }, 100);
    }

    window.Routes = {
        addRoute: addRoute,
        loadRoute: loadRoute,
        removeRoute: removeRoute,
    };
}(window));