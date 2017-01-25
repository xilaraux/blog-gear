var Blog = (function () {
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

    // Private variables for current blog module state.
    var _isActivated = false;
    var _allPosts = null;
    var _frames = {
        blog: null,
    };
    var _currentUser = null;

    // Function will be loaded when someone would try to load some page like /blog or /blog/*
    function _provideRoutes() {
        if(_isActivated) {
            return;
        }

        _isActivated = true;

        // Handle categories
        var categories = _config.data.posts;
        for(var category in categories) {
            (function (categoryName) {
                Routes.addRoute('/blog/' + categoryName, 'Blog | ' + categoryName, function () {
                    _updateContent(_getPostsByCategory(categoryName));
                    _includePagination();
                });
            }(category));
        }

        // Allow to access posts one by one.
        for(var i = 0, length = _allPosts.length; i < length; i++) {
            (function(post) {
                Routes.addRoute('/blog/' + post.url, 'Blog | ' + post.title, function () {
                    _updateContent(_createPost(post, true));
                    _includePagination();
                });
            }(_allPosts[i]));
        }

        // Work on blog pagination
        for(var i = 0, length = _frames.blog.length; i < length; i++) {
            (function(frame, index) {
                Routes.addRoute('/blog/' + index, 'Blog | ' + index, function () {
                    _updateContent(frame.cloneNode(true));
                });
            }(_frames.blog[i], i));
        }
    }

    // Gets name of the category, returns DOM fragment of the posts from the current category.
    function _getPostsByCategory(category) {
        var categoryData = _config.data.posts[category];

        if(!categoryData) {
            return;
        }

        var posts = document.createDocumentFragment();

        for(var i = 0, length = categoryData.length; i < length; i++) {
            posts.appendChild(_createPost(categoryData[i]));
        }

        return posts;
    }

    // Gets array of data, returns array of DOM fragments which is pages for pagination
    function _splitOnFrames(dataSet) {
        var result = [];
        var allowedPages = _config.postsOnPage;
        var frame = document.createDocumentFragment();

        for(var i = 0, length = dataSet.length; i < length; i++) {
            if(i != 0 && i % allowedPages == 0) {
                result.push(frame);
                frame = document.createDocumentFragment();
                frame.appendChild(_createPost(_allPosts[i]));
                continue;
            }
            frame.appendChild(_createPost(_allPosts[i]));
        }
        result.push(frame);

        return result;
    }

    // Gets array of DOM fragments(pages) and URL prefix for them.
    // Returns DOM elemet of pagination panel.
    function _createPagination(pageFrames, urlPrefix) {
        var paginationPanel = createElemWithClass('div', 'blog__pagination pagination');

        for(var i = 0, length = pageFrames.length; i < length; i++) {
            var item = createElementByObject({
                tagName: 'a',
                className: 'pagination__item route',
                href: '#/' + urlPrefix + '/' + i,
                innerHTML: '' + i,
            });

            paginationPanel.appendChild(item);
        }

        return paginationPanel;
    }

    function _addNewUser(userData) {
        var users = _config.data.users;

        if(users[userData.name]) {
            console.log('Blog:: User already exists.');
            return;
        }

        users[userData.name] = {
            password: userData.password
        };

        console.log('Blog:: New user was registered successfully.', users);
    }

    function _loginInBlog(userData) {
        if(_currentUser) {
            return;
        }

        var users = _config.data.users;

        var name = userData.name,
            pass = userData.password;

        if(!users[name] || users[name].password !== pass) {
            console.log('Blog:: Something wrong with your data.');
            return;
        }

        _currentUser = {
            name: name,
            password: pass
        };
        _updateUserInterface();
    }

    function _createBlogInterface() {
        function onBlogSearch(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var searchInput = document.querySelectorAll('.blog__search')[0];
            if(!searchInput || searchInput.value.length == 0) {
                return;
            }

            var postsWithTitle = _searchPostsByTitle(searchInput.value);

            var posts = document.createDocumentFragment();
            for(var i = 0, length = postsWithTitle.length; i < length; i++) {
                posts.appendChild(_createPost(postsWithTitle[i]));
            }

            _includePagination();
            _updateContent(posts);
        }

        function onBlogLogin(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var target = e.target || e.srcElement;

            var name = document.querySelectorAll('.control__name')[0],
                pass = document.querySelectorAll('.control__pass')[0];

            if(name.value.length == 0) return;
            if(pass.value.length == 0) return;

            _loginInBlog({name: name.value, password: pass.value});
        }

        function onBlogRegistry(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var target = e.target || e.srcElement;

            var currentClass = target.className;
            if(currentClass.indexOf('control__registry') == -1) {
                return;
            }

            var name = document.querySelectorAll('.control__name')[0],
                pass = document.querySelectorAll('.control__pass')[0];

            if(name.value.length == 0) return;
            if(pass.value.length == 0) return;

            _addNewUser({name: name.value, password: pass.value});

            name.value = '';
            pass.value = '';
        }

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

        if(!_currentUser) {
            blogPanel.appendChild(createElementByObject({
                tagName: 'form',
                className: 'blog__form control',
                onsubmit: onBlogLogin,
                innerHTML: '<input type="text" class="control__name blog__input" placeholder="Login" />' +
                            '<input type="password" class="control__pass blog__input" placeholder="Password" />' +
                            '<button type="submit" class="blog__button control__login">Log in</button>',
                children: [
                    {
                        tagName: 'button',
                        className: 'blog__button control__registry',
                        innerHTML: 'Registry',
                        onclick: onBlogRegistry
                    }
                ]
            }));
        } else {
            blogPanel.appendChild(_createUserInterface());
        }

        return blogPanel;
    }

    function _createUserInterface() {
        // TODO: create interface for blog: add post, remove post, maybe change
        // TODO: social sharing
        return createElementByObject({
            tagName: 'p',
            innerHTML: _currentUser.name + ' ' + _currentUser.password
        });
    }

    function _updateUserInterface() {
        var oldInterface = document.querySelectorAll('.control')[0];

        try {
            oldInterface.innerHTML = '';
        } catch (e) {
            console.error('Blog:: Blog interface is not exist.');
        }

        oldInterface.appendChild(_createUserInterface());
    }

    function _getAllPostsData() {
        if(_allPosts) {
            return _allPosts;
        }

        _allPosts = [];
        var posts = _config.data.posts;
        for (var category in posts) {
            _allPosts = _allPosts.concat(posts[category]);
        }

        return _allPosts;
    }

    // Search post by title
    function _searchPostsByTitle(title) {
        var posts = _getAllPostsData();
        var result = [];

        for(var i = 0, length = posts.length; i < length; i++) {
            var currentTitle = posts[i].title.toLowerCase();
            if(currentTitle.indexOf(title.toLowerCase()) >= 0) {
                result.push(posts[i]);
            }
        }

        return result;
    }

    // Return generated comments panel for users.
    function _createCommentPanel(postData) {
        function onSubmit(e) {
            var result = {};

            try {
                result.name = _currentUser.name;
            } catch (e) {
                var userNameArea = document.querySelectorAll('.add-comment__name')[0];

                if(userNameArea.value.length == 0) {
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

            if(!postData.comments) {
                postData.comments = [];
            }

            postData.comments.push(result);

            _updateContent(_createPost(postData, true));
        }

        var addCommentPanel = createElemWithClass('div', 'post__add-comment add-comment');

        if(!_currentUser) {
            var nameArea = createElemWithClass('input', 'add-comment__name');
            nameArea.type = 'text';

            addCommentPanel.appendChild(nameArea);
        }

        var commentArea = createElemWithClass('textarea', 'add-comment__area');
        addCommentPanel.appendChild(commentArea);

        var addComment = createElemWithClass('button', 'add-comment__button');
        addComment.innerHTML = 'Add comment';
        addCommentPanel.appendChild(addComment);

        addEventListener(addComment, 'click', onSubmit);

        return addCommentPanel;
    }

    // Create and provide actions on comments panel.
    function _createComments(commentsData) {

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
    }

    // Gets object which represents data of the current post and special mark for place were post will be added.
    // Returns DOM element of post.
    function _createPost(postData, isAlone) {
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
            var content = createElementByObject({
               tagName: 'p',
                className: 'post__content',
                innerHTML: postData.content
            });
            post.appendChild(content);

            var comments = _createComments(postData.comments);
            post.appendChild(comments);

            var commentPanel = _createCommentPanel(postData);
            post.appendChild(commentPanel);
        }

        return post;
    }

    // Gets DOM element of pagination, include it in blog page.
    // If gets nothing, remove pagination panel that is exist or does nothing.
    function _includePagination(pagination) {
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
    }

    // Gets DOM element of data for including.
    // If blog content element exist, previous data will be removed and new included in block.
    function _updateContent(content) {
        var blogContent = document.querySelectorAll('.blog__content')[0];

        if(!blogContent) {
            return;
        }

        blogContent.innerHTML = '';
        blogContent.appendChild(content);
    }

    // Create blog element and return it.
    function _create() {
        var container = createElemWithClass('div', 'container container_blog');

        var blog = createElemWithClass('div', 'blog');

        var blogContent = createElemWithClass('div', 'blog__content');

        blog.appendChild(_createBlogInterface());

        _frames.blog = _splitOnFrames(_getAllPostsData());

        blogContent.appendChild(_frames.blog[0].cloneNode(true));

        var paginationPanel = _createPagination(_frames.blog, 'blog');

        blog.appendChild(blogContent);
        blog.appendChild(paginationPanel);

        container.appendChild(blog);
        return container;
    }

    // Function for export, start blog processes
    function start() {
        _provideRoutes();
    }

    // Provide configs for blog and return it.
    function init(config) {
        extend(_config, config);

        return _create();
    }

    return {
        init: init,
        start: start,
    };
}());