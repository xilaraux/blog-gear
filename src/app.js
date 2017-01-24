var App = (function () {
    // Data
    var _data = {
        store: {
            script: null,
            src: './store/store.js',
        },
    };

    var _modules = {
        routes: {
            script: null,
            src: './src/modules/routes.js',
        },
        menu: {
            script: null,
            src: './src/modules/menu.js',
        },
        contacts: {
            script: null,
            src: './src/modules/contacts.js',
        },
        blog: {
            script: null,
            src: './src/modules/blog.js',
        },
        slider: {
            script: null,
            src: './src/modules/slider/index.js',
        },
        gallery: {
            script: null,
            src: './src/modules/gallery/index.js',
        },
    };

    function _includeModule(module, callback) {
        if(module.script) {
            callback();
            return;
        }

        var head = document.getElementsByTagName('head')[0];

        var moduleScript = document.createElement('script');
        moduleScript.type = 'text/javascript';
        moduleScript.src = module.src;
        moduleScript.defer = true;
        // hack for dynamic module usage
        moduleScript.onreadystatechange = callback;
        moduleScript.onload = callback;


        // add script at the end of the tag
        head.appendChild(moduleScript);
        module.script = moduleScript;
    }

    function _appClickHandler(e) {
        e = e || window.event;

        var target = e.target || e.srcElement;

        if(target.nodeName == "A" && target.className.indexOf('route') != -1) {
            window.location.hash = getHashFromURL(target.href);
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }
    }

    function _routesLoadHandler() {
        function routesHandler(e) {
            Routes.loadRoute(window.location.hash);
        }

        Routes.addRoute('/', 'Home page', function () {
            _includeModule(_modules.slider, function() {
                _render(Slider.init());
                Slider.start();
            });
        });

        Routes.addRoute('/gallery', 'Gallery', function () {
            _includeModule(_modules.gallery, function() {
                _render(Gallery.init());
            });
        });

        Routes.addRoute('/contacts', 'Contacts', function () {
            _includeModule(_modules.contacts, function () {
               _render(Contacts.init());
               Contacts.start();
            });
        });

        // Working with blog routes
        function onBlogLoadHandler() {
            _render(Blog.init({
                postsOnPage: 3,
                data: store,
            }));
            Blog.start();
        }
        Routes.addRoute('/blog', 'Blog', function () {
            _includeModule(_modules.blog, onBlogLoadHandler);
        });

        Routes.addRoute('/blog/*', 'Blog', function () {
            _includeModule(_modules.blog, onBlogLoadHandler);
        });

        // Activate routes events, that app could change its state.
        window.onload = routesHandler;
        window.onhashchange = routesHandler;
    }

    function _render(module) {
        // console.time('App::_render()');
        var content = document.querySelectorAll('.content')[0];
        var pageContainer = document.querySelectorAll('.page-container')[0];

        // Check that content block exist
        if(!content) {
            content = createElemWithClass('div', 'content');
        }

        content.innerHTML = '';

        if(module) {
            content.appendChild(module);
        }

        if(!pageContainer) {
            pageContainer = createElemWithClass('div', 'page-container');

            document.body.insertBefore(pageContainer, document.body.firstElementChild);
        }

        pageContainer.appendChild(content);
        // console.timeEnd('App::_render()');
    }

    function init() {
        // Disable all links on the page
        addEventListener(document.body, 'click', _appClickHandler);

        // Include data
        _includeModule(_data.store, function() {
            console.log('Data has been loaded.');
        });

        // Include application routes
        _includeModule(_modules.routes, function() {
            _routesLoadHandler();
        });

        // Provide menu events
        _includeModule(_modules.menu, function () {

        });
    }

    return {
        init: init
    };
}());

// console.time('App::init()');
App.init();
// console.timeEnd('App::init()');