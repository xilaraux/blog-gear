;(function (window) {
    // Default data
    var _config = {
        postsOnPage: 2,
        data: {
            users: {
                'admin': {
                    password: 'admin',
                    group: 'admin'
                },
            },
            posts: {},
        },
    };

    /**
     * Blog's state and methods to change some of them
     * @property {boolean} isActivated,
     * @property {Array} allPosts,
     * @property {Array} frames,
     * @property {object} currentUser,
     * @property {DOM Node} node
     * @private
     */
    var _BLOG = {
        isActivated: false,
        allPosts: null,
        frames: null,
        currentUser: null,
        currentPost: null,
        node: null,
    };

    /**
     * Split data at the blog on frames
     * @param dataSet
     * @return {Array} blog pages
     */
    _BLOG.splitOnFrames = function(dataSet) {
        var result = [];
        var allowedPages = _config.postsOnPage;
        var frame = document.createDocumentFragment();

        for(var i = 0, length = dataSet.length; i < length; i++) {
            if(i != 0 && i % allowedPages == 0) {
                result.push(frame);
                frame = document.createDocumentFragment();
                frame.appendChild(_POSTS.createPost(this.allPosts[i]));
                continue;
            }
            frame.appendChild(_POSTS.createPost(this.allPosts[i]));
        }
        result.push(frame);

        this.frames = result;
        return result;
    };

    /**
     * Register new user
     * @param userData
     */
    _BLOG.addUser = function (userData) {
        var users = _config.data.users;

        if(users[userData.name]) {
            console.log('Blog:: User already exists.');
            return;
        }

        users[userData.name] = {
            password: userData.password
        };

        console.log('Blog:: New user was registered successfully.', users);
    };

    /**
     * Log in user
     * @param userData
     */
    _BLOG.login = function (userData) {
        if(this.currentUser) {
            return;
        }

        var users = _config.data.users;

        var name = userData.name,
            pass = userData.password;

        if(!users[name] || users[name].password !== pass) {
            console.log('Blog:: Something wrong with your data.');
            return;
        }

        this.currentUser = {
            name: name,
            password: pass
        };

        _UserInterface.update();
    };

    /**
     * Log out current user
     */
    _BLOG.logout = function () {
        if(!this.currentUser) return;

        this.currentUser = null;

        _UserInterface.update();
    };

    /**
     * Contains methods for work with posts
     * @type {Object}
     * @private
     */
    var _POSTS = {};

    /**
     * @function getPostsData
     * @return {Array} posts data array
     */
    _POSTS.getPostsData = function (/* forceMode */) {
        // if(!forceMode && _BLOG.allPosts) {
        //     return _BLOG.allPosts;
        // }

        _BLOG.allPosts = [];
        var posts = _config.data.posts;
        for (var category in posts) {
            _BLOG.allPosts = _BLOG.allPosts.concat(posts[category]);
        }

        return _BLOG.allPosts;
    };

    /**
     * Create document fragment with posts in it.
     * @param category
     * @return {DocumentFragment} Posts
     */
    _POSTS.getByCategory = function (category) {
        var categoryData = _config.data.posts[category];

        if(!categoryData) {
            return;
        }

        var posts = document.createDocumentFragment();

        for(var i = 0, length = categoryData.length; i < length; i++) {
            posts.appendChild(_POSTS.createPost(categoryData[i]));
        }

        return posts;
    };

    /**
     * Create post DOM Node by template
     * @param {object} postData - contains post data
     * @param {boolean} isAlone - if post should be created for own
     * @return {DOM Node} post
     */
    _POSTS.createPost = function (postData, isAlone) {
        var post = createElementByObject({
            tagName: 'div',
            className: 'blog__post post',
            children: [
                {
                    tagName: 'img',
                    className: 'post__image',
                    src: postData.image,
                    alt: postData.title
                },
                {
                    tagName: 'h2',
                    className: 'post__title',
                    children: [
                        {
                            tagName: 'a',
                            className: 'post__link route',
                            href: '#/blog/' + postData.url,
                            innerHTML: postData.title
                        }
                    ]
                },
                {
                    tagName: 'p',
                    className: 'post__description',
                    innerHTML: postData.description
                }
            ]
        });

        if(isAlone) {
            _BLOG.currentPost = postData;

            var content = createElementByObject({
                tagName: 'p',
                className: 'post__content',
                innerHTML: postData.content
            });
            post.appendChild(content);

            var comments = _UserInterface.createComments(postData.comments);
            post.appendChild(comments);

            var commentPanel = _UserInterface.createCommentPanel();
            post.appendChild(commentPanel);
        }

        return post;
    };

    /**
     * Search posts which contains this title
     * @param title - post's title that we're looking for
     * @return {Array} data about posts which include this title
     */
    _POSTS.searchByTitle = function (title) {
        var posts = _POSTS.getPostsData();
        var result = [];

        for(var i = 0, length = posts.length; i < length; i++) {
            var currentTitle = posts[i].title.toLowerCase();
            if(currentTitle.indexOf(title.toLowerCase()) >= 0) {
                result.push(posts[i]);
            }
        }

        return result;
    };

    /**
     * Contains methods for work with blog's user interface elements.
     * @type {object}
     * @private
     */
    var _UserInterface = {};

    /**
     * Method for producing user interface
     * @private
     * @return {DOM Node} user interface
     */
    _UserInterface.create = function() {
        function onBlogRegistry(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var target = e.target || e.srcElement;

            var currentClass = target.className;
            if(currentClass.indexOf('user-interface__registry') == -1) {
                return;
            }

            var name = document.querySelectorAll('.user-interface__name')[0],
                pass = document.querySelectorAll('.user-interface__pass')[0];

            if(name.value.length == 0) return;
            if(pass.value.length == 0) return;

            _BLOG.addUser({name: name.value, password: pass.value});

            name.value = '';
            pass.value = '';
        }

        function onBlogLogin(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var target = e.target || e.srcElement;

            var name = document.querySelectorAll('.user-interface__name')[0],
                pass = document.querySelectorAll('.user-interface__pass')[0];

            if(name && name.value.length == 0) return;
            if(pass && pass.value.length == 0) return;

            _BLOG.login({name: name.value, password: pass.value});

            if(document.querySelectorAll('.add-comment')[0])
                _UserInterface.updateCommentPanel();
        }

        function onBlogLogout(e) {
            _BLOG.logout();

            if(document.querySelectorAll('.add-comment')[0])
                _UserInterface.updateCommentPanel();
        }

        function onAddNewPost(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var posts = _config.data.posts;

            var title = document.querySelectorAll('.create-post__title')[0];
            var description = document.querySelectorAll('.create-post__description')[0];
            var image = document.querySelectorAll('.create-post__image')[0];
            var content = document.querySelectorAll('.create-post__content')[0];

            var categoriesList = document.querySelectorAll('.create-post__categories')[0];
            // var categoryNew = document.querySelectorAll('.create-post__category-name_new')[0];

            if(title.value.length == 0 ||
                description.value.length == 0 ||
                image.value.length == 0 ||
                content.value.length == 0 ||
                categoriesList.value.length == 0) {
                    console.error('Blog:: You should fill all fields.');
                    return;
                }

            // if(categoryNew.value.length != 0) category = categoryNew.value;

            var category = categoriesList.value;

            if(!posts[category]) posts[category] = [];

            var currentPost = {
                url: title.value.toLowerCase().replace(/\s/g,'-'),
                title: title.value,
                image: image.value,
                description: description.value,
                content: content.value
            };

            title.value = '';
            image.value = '';
            description.value = '';
            content.value = '';

            posts[category].push(currentPost);

            // Fix: doesn't show at pagination
            // _POSTS.getPostsData();
            // _BLOG.splitOnFrames(_POSTS.getPostsData());

            Routes.addRoute('/blog/' + currentPost.url, 'Blog | ' + currentPost.title, function () {
                _updateContent(_POSTS.createPost(currentPost, true));
                _UserInterface.includePagination();
            });
        }

        var userInterface = null;
        if(!_BLOG.currentUser) {
            userInterface = createElementByObject({
                tagName: 'form',
                className: 'blog__form user-interface',
                onsubmit: onBlogLogin,
                innerHTML: '<input type="text" class="user-interface__name blog__input" placeholder="Login" />' +
                '<input type="password" class="user-interface__pass blog__input" placeholder="Password" />' +
                '<button type="submit" class="blog__button user-interface__login">Log in</button>',
                children: [
                    {
                        tagName: 'button',
                        className: 'blog__button user-interface__registry',
                        innerHTML: 'Registry',
                        onclick: onBlogRegistry
                    }
                ]
            });

            return userInterface;
        }

        var categoriesOptions = [];
        var categories = _config.data.posts;
        categoriesOptions.push(createElementByObject({
            tagName: 'option',
            className: 'create-post__category-name',
            disabled: true,
            selected: true,
            innerHTML: 'Choose category name'
        }));
        for(var name in categories) {
            categoriesOptions.push(createElementByObject({
                tagName: 'option',
                className: 'create-post__category-name',
                value: name,
                innerHTML: name
            }));
        }

        userInterface = createElementByObject({
            tagName: 'div',
            className: 'user-interface',
            children: [
                {
                    tagName: 'p',
                    className: 'user-interface__greeting',
                    innerHTML: 'Hello, ' + _BLOG.currentUser.name + '!'
                },
                {
                    tagName: 'button',
                    className: 'blog__input user-interface__logout',
                    innerHTML: 'Logout',
                    onclick: onBlogLogout
                },
                {
                    tagName: 'form',
                    className: 'create-post blog__form',
                    innerHTML: '<input type="text" class="blog__input create-post__title" placeholder="Post title" />' +
                                '<input type="text" class="blog__input create-post__description" placeholder="Post description" />' +
                                '<input type="text" class="blog__input create-post__image" placeholder="Link to image" />' +
                                '<textarea class="blog__textarea create-post__content" placeholder="Post content" />',
                    children: [
                        {
                            tagName: 'select',
                            className: 'blog__input create-post__categories',
                            children: categoriesOptions
                        },
                        // {
                        //     tagName: 'input',
                        //     className: 'blog__input create-post__category-name create-post__category-name_new',
                        //     placeholder: 'New category'
                        // },
                        {
                            tagName: 'button',
                            className: 'blog__button create-post__add',
                            innerHTML: 'Add new post',
                            onclick: onAddNewPost
                        }
                    ]
                }
            ]
        });

        return userInterface;
    };

    /**
     * Method replaced old interface by new one
     */
    _UserInterface.update = function () {
        var oldInterface = document.querySelectorAll('.user-interface')[0];

        try {
            oldInterface.innerHTML = '';
        } catch (e) {
            console.error('Blog:: Blog interface is not exist.');
        }

        oldInterface.parentNode.replaceChild(_UserInterface.create(), oldInterface);
    };

    /**
     * Create comments interface for post
     * @param postData - for adding comments
     */
    _UserInterface.createCommentPanel = function () {
        function onSubmit(e) {
            var result = {};

            try {
                result.name = _BLOG.currentUser.name;
            } catch (e) {
                var userNameArea = document.querySelectorAll('.add-comment__name')[0];
                var userVal = [];
                try{
                    userVal = userNameArea.value;
                } catch (e) {
                    console.error('Blog:: You\'re not allowed to make comment right now. Please, reload page.');
                }

                if(userVal.length == 0) {
                    return;
                }

                result.name = userNameArea.value;
                userNameArea.value = '';
            }

            var contentArea = document.querySelectorAll('.add-comment__area')[0];

            if(contentArea.value.length == 0) {
                return;
            }

            result.content = contentArea.value;
            contentArea.value = '';

            if(_BLOG.currentPost && !_BLOG.currentPost.comments) {
                _BLOG.currentPost.comments = [];
            }

            _BLOG.currentPost.comments.push(result);

            _updateContent(_POSTS.createPost(_BLOG.currentPost, true));
        }

        var nameArea = createElemWithClass('p');
        if(!_BLOG.currentUser) {
            nameArea = createElementByObject({
                tagName: 'input',
                className: 'add-comment__name',
                placeholder: 'Name',
                type: 'text'
            });
        }

        return createElementByObject({
            tagName: 'div',
            className: 'post__add-comment add-comment',
            children: [
                nameArea,
                {
                    tagName: 'textarea',
                    className: 'add-comment__area',
                    placeholder: 'Comment'
                },
                {
                    tagName: 'button',
                    className: 'add-comment__button',
                    innerHTML: 'Add comment',
                    onclick: onSubmit
                }
            ]
        });
    };

    /**
     * Update comments interface for post
     * @param postData
     */
    _UserInterface.updateCommentPanel = function () {
        var oldPanel = document.querySelectorAll('.add-comment')[0];

        try {
            oldPanel.innerHTML = '';
        } catch (e) {
            console.error('Blog:: Comment interface is not exist.');
        }

        oldPanel.parentNode.replaceChild(this.createCommentPanel(), oldPanel);
    };

    /**
     * Create comments components.
     * @param commentsData
     */
    _UserInterface.createComments = function (commentsData) {
        if(!commentsData) {
            return createElemWithClass('div', 'post__comments');
        }

        var comments = createElemWithClass('div', 'post__comments');
        for(var i = 0, length = commentsData.length; i < length; i++) {
            var comment = createElementByObject({
                tagName: 'div',
                className: 'comment',
                children: [
                    {
                        tagName: 'p',
                        className: 'comment__name',
                        innerHTML: commentsData[i].name
                    },
                    {
                        tagName: 'p',
                        className: 'comment__content',
                        innerHTML: commentsData[i].content
                    }
                ]
            });

            comments.appendChild(comment);
        }

        return comments;
    };

    /**
     * Create pagination panel with items and right links
     * @param pageFrames
     * @param urlPrefix
     * @return {DOM Node} pagination panel
     */
    _UserInterface.createPagination = function (pageFrames, urlPrefix) {
        var items = [];
        for(var i = 0, length = pageFrames.length; i < length; i++) {
            var item = createElementByObject({
                tagName: 'a',
                className: 'pagination__item route',
                href: '#/' + urlPrefix + '/' + i,
                innerHTML: '' + i,
            });

            items[i] = item;
        }

        return createElementByObject({
            tagName: 'div',
            className: 'blog__pagination pagination',
            children: items
        });
    };

    /**
     * Include pagination panel if it's not exists or, in other case, delete
     * @param pagination
     */
    _UserInterface.includePagination = function (pagination) {
        var blog = document.querySelectorAll('.blog')[0];
        var oldPagin = document.querySelectorAll('.blog__pagination')[0];

        if(oldPagin) {
            blog.removeChild(oldPagin);
        }

        if(!blog) {
            return;
        }

        if(!pagination) {
            return;
        }

        blog.appendChild(pagination);
    };

    /**
     * Called from start method. Create blog's routes.
     * @private
     */
    function _provideRoutes() {
        if(_BLOG.isActivated) {
            return;
        }

        _BLOG.isActivated = true;

        // Handle categories
        var categories = _config.data.posts;
        for(var category in categories) {
            (function (categoryName) {
                Routes.addRoute('/blog/' + categoryName, 'Blog | ' + categoryName, function () {
                    _updateContent(_POSTS.getByCategory(categoryName));
                    _UserInterface.includePagination();
                });
            }(category));
        }

        // Allow to access posts one by one.
        for(var i = 0, length = _BLOG.allPosts.length; i < length; i++) {
            (function(post) {
                Routes.addRoute('/blog/' + post.url, 'Blog | ' + post.title, function () {
                    _updateContent(_POSTS.createPost(post, true));
                    _UserInterface.includePagination();
                });
            }(_BLOG.allPosts[i]));
        }

        // Work on blog pagination
        for(var i = 0, length = _BLOG.frames.length; i < length; i++) {
            (function(frame, index) {
                Routes.addRoute('/blog/' + index, 'Blog | ' + index, function () {
                    _updateContent(frame.cloneNode(true));
                });
            }(_BLOG.frames[i], i));
        }
    }

    /**
     * Create blog interface
     * @return {DOM Node} blog panel
     */
    function _createInterface() {
        function onBlogSearch(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var searchInput = document.querySelectorAll('.blog__search')[0];
            if(!searchInput || searchInput.value.length == 0) {
                return;
            }

            var postsWithTitle = _POSTS.searchByTitle(searchInput.value);

            var posts = document.createDocumentFragment();
            for(var i = 0, length = postsWithTitle.length; i < length; i++) {
                posts.appendChild(_POSTS.createPost(postsWithTitle[i]));
            }

            searchInput.value = '';

            _UserInterface.includePagination();
            _updateContent(posts);
        }

        // TODO: make search menu slide
        var blogPanel = createElementByObject({
            tagName: 'div',
            className: 'blog__nav',
            children: [
                {
                    tagName: 'form',
                    className: 'blog__form',
                    onsubmit: onBlogSearch,
                    innerHTML: '<input type="text" class="blog__search blog__input" placeholder="Search input" />' +
                                '<button type="submit" class="blog__button search">Search</button>'
                }
            ]
        });

        blogPanel.appendChild(_UserInterface.create());

        return blogPanel;
    }

    /**
     * Function that update content on the current page
     * @param {DOM Node} content - will be included
     */
    function _updateContent(content) {
        var blogContent = document.querySelectorAll('.blog__content')[0];

        if(!blogContent) {
            return;
        }

        blogContent.innerHTML = '';
        blogContent.appendChild(content);
    };

    /**
     * Create blog's DOM Node
     * @function _create
     * @private
     * @return {DOM Node} Blog's container
     */
    function _create() {
        // Prevent re-creation
        // if(_BLOG.node) {
        //     return _BLOG.node;
        // }

        if(!_BLOG.frames) {
            _BLOG.splitOnFrames(_POSTS.getPostsData());
        }

        var container = createElementByObject({
            tagName: 'div',
            className: 'container container_blog',
            children: [
                {
                    tagName: 'div',
                    className: 'blog',
                    children: [
                        _createInterface(),
                        {
                            tagName: 'div',
                            className: 'blog__content',
                            children: [
                                _BLOG.frames[0].cloneNode(true)
                            ]
                        },
                        _UserInterface.createPagination(_BLOG.frames, 'blog')
                    ]
                }
            ]
        });

        // _BLOG.node = container;
        return container;
    }

    /**
     * On blog start function. Should be called after blog's rendering.
     * @function start
     */
    function start() {
        _provideRoutes();
    }

    /**
     * Initial function for whole blog.
     * @param config - it is optional, extend default module's state
     * @return {DOM Node}
     */
    function init(config) {
        extend(_config, config);

        return _create();
    }

    window.Blog = {
        init: init,
        start: start,
    };

}(window));