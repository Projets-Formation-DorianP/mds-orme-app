import Axios from "axios";

export default class Favorite {
    constructor(favoritesBloc, favoritesSidebarList, favoritesAdd, favoritesEdit, favoritesTrash, favoritesPopup, favoritesPopupClose, favoritesPopupChoices,formFavoris, abandonFavoris, persistFavoris) {
        this.favoritesBloc = favoritesBloc;
        this.favoritesSidebarList = favoritesSidebarList;
        this.favoritesEdit = favoritesEdit;
        this.favoritesTrash = favoritesTrash;
        this.favoritesPopup = favoritesPopup;
        this.formFavoris = formFavoris;

        if(this.favoritesBloc) {
            this.favoritesAdd = favoritesAdd;

            if(this.favoritesAdd) {
                this.listenOnClickFavoritesAdd(this.favoritesAdd);
            }
        }

        if(this.favoritesEdit) {
            this.listenOnClickFavoritesEdit();
        }

        if(this.favoritesTrash) {
            this.listenOnClickFavoritesTrash();
        }

        if(this.favoritesPopup) {
            this.favoritesPopupClose = favoritesPopupClose;
            this.favoritesPopupChoices = favoritesPopupChoices;

            if(this.favoritesPopupClose) {
                this.listenOnClickFavoritesPopupClose(favoritesPopupClose);
            }

            if(this.favoritesPopupChoices) {
                this.listenOnClickFavoritesPopupChoices(this.favoritesPopupChoices);
            }
        }

        if(this.formFavoris) {
            this.abandonFavoris = abandonFavoris;
            this.persistFavoris = persistFavoris;

            if(this.abandonFavoris) {
                this.listenOnClickAbandon(this.abandonFavoris);
            }

            if(this.persistFavoris) {
                this.listenOnClickPersist(this.persistFavoris);
            }
        }
    }

    listenOnClickFavoritesAdd(add) {
        add.addEventListener('click', event => {
            event.preventDefault();
            this.openPopup();
        })
    }

    listenOnClickFavoritesEdit() {
        this.favoritesEdit.map((edit) => {
            edit.addEventListener('click', event => {
                event.preventDefault();
                
                document.querySelector('.sidebar.right > .widgets').classList.add('active');
                document.querySelector('.sidebar.right div.favorites__form').classList.remove('active');

                Favorite.listenOnChangeTitleInput();
                Favorite.listenOnChangeIconInput();
                Favorite.listenOnChangeUrlInput();

                const url = `/favorite/read-one/${edit.dataset.id}`;
                Axios.get(url).then(function(response) {
                    console.log(response);
                    // Takes form elements
                    var titleInput = document.querySelector('.favorites__form input[name="title"]');
                    var iconInput = document.querySelector('.favorites__form input[name="icon"]');
                    var linkInput = document.querySelector('.favorites__form input[name="link"]');

                    var data = response.data.favorite;
                    // Set dataset Id like response
                    titleInput.dataset.id = edit.dataset.id;
                    iconInput.dataset.id = edit.dataset.id;
                    linkInput.dataset.id = edit.dataset.id;

                    // Set content on dataset content
                    titleInput.dataset.content = data.title;
                    iconInput.dataset.content = data.data.icon;
                    linkInput.dataset.content = data.data.url;
                    
                    //Set content like response
                    titleInput.value = data.title;
                    iconInput.value = data.data.icon;
                    linkInput.value = data.data.url;
                })
            })
        })
    }

    listenOnClickFavoritesTrash() {
        this.favoritesTrash.map((trash) => {
            trash.addEventListener('click', event => {
                event.preventDefault();
                
                // Remove on favorites bloc
                var favorite = document.querySelector(`.diary__bloc.favorites > a[data-id="${trash.dataset.id}"]`);
                favorite.remove();

                // Remove on favorites list
                var liFavorite = document.querySelector(`.favorites__items[data-id="${trash.dataset.id}"]`);
                liFavorite.remove();

                // Remove favorite on database
                const url = `/favorite/delete/${trash.dataset.id}`;
                Axios.get(url).then(function(response) {
                    console.log(url);
                })
            })
        })
    }

    listenOnClickFavoritesPopupClose(close) {
        close.addEventListener('click', event => {
            event.preventDefault();
            this.closePopup();
        })
    }

    listenOnClickFavoritesPopupChoices(icons) {
        icons.map((icon) => {
            icon.addEventListener('click', event => {
                event.preventDefault();
                this.createFavorite(icon.dataset.favorite)
                this.closePopup();
            })
        })
    }

    createFavorite(favorite) {
        // Get img link and url
        switch (favorite) {
            case 'facebook':
                var href    = "https://www.facebook.com/";
                var src     = "https://image.flaticon.com/icons/svg/1077/1077041.svg"
                break;
            case 'instagram':
                var href    = "https://www.instagram.com/";
                var src     = "https://image.flaticon.com/icons/svg/1077/1077042.svg"
                break;
            case 'twitter':
                var href    = "https://twitter.com/twitter";
                var src     = "https://image.flaticon.com/icons/svg/1051/1051382.svg"
                break;
            case 'reddit':
                var href    = "https://www.reddit.com/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111791.svg"
                break;
            case 'youtube':
                var href    = "https://www.youtube.com/";
                var src     = "https://image.flaticon.com/icons/svg/1077/1077046.svg"
                break;
            case 'spotify':
                var href    = "https://www.spotify.com/fr/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111805.svg"
                break;  
            case 'deezer':
                var href    = "https://www.deezer.com/fr/";
                var src     = "https://image.flaticon.com/icons/svg/49/49080.svg"
                break;   
            case 'gmail':
                var href    = "https://mail.google.com/";
                var src     = "https://image.flaticon.com/icons/svg/2150/2150313.svg"
                break;   
            case 'airbnb':
                var href    = "https://www.airbnb.fr/";
                var src     = "https://image.flaticon.com/icons/svg/888/888886.svg"
                break;   
            case 'trello':
                var href    = "http://trello.com/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111719.svg"
                break;   
            case 'default':
                var href    = "#!";
                var src     = "https://image.flaticon.com/icons/svg/2235/2235669.svg"
                break;  
            default:
                alert('Sorry, ' + favorite + ' doesn\'t exists');
                break;
        }

        // Create new favorite on database
        var data = {
            icon : src,
            url : href
        };

        const url = `/favorite/create/${this.capitalizeFirstLetter(favorite)}/${encodeURIComponent(window.btoa(JSON.stringify(data)))}`;
        Axios.get(url).then(function(response) {
            var id = response.data.id;

            // Create new favorite on favorites bloc
            var img = document.createElement('img');
            img.src = src;

            var div = document.createElement('div');
            div.classList.add('item', 'orme');

            var a = document.createElement('a');
            a.href = href;
            a.dataset.id = id;

            div.appendChild(img);
            a.appendChild(div);
            var favoritesBloc = document.querySelector('.diary__bloc.favorites');
            var favoritesAdd = document.querySelector('.favorites__add');
            favoritesBloc.insertBefore(a, favoritesAdd);

            // Create new favorite on favorites list
            var span = document.createElement('span');
            span.innerHTML = favorite;

            var div = document.createElement('div');
            div.classList.add('favorites__items-infos');

            var trash = document.createElement('div');
            trash.classList.add('favorites__trash');
            trash.dataset.id = id;

            var aTrash = document.createElement('a');
            aTrash.href = '#';

            var edit = document.createElement('div');
            edit.classList.add('favorites__modify');
            edit.dataset.id = id;

            var aEdit = document.createElement('a');
            aEdit.href = '#';

            var divActions = document.createElement('div');
            divActions.classList.add('favorites__items-actions');

            var li = document.createElement('li');
            li.classList.add('favorites__items');
            li.dataset.id = id;

            div.appendChild(span);
            aTrash.appendChild(trash);
            aEdit.appendChild(edit);
            divActions.appendChild(aTrash);
            divActions.appendChild(aEdit);
            li.appendChild(div);
            li.appendChild(divActions);
            var favoritesSidebarList = document.querySelector('.favorites__list');
            favoritesSidebarList.appendChild(li);

            // Set event listener for elt
            trash.addEventListener('click', event => {
                event.preventDefault();
                
                // Remove on favorites bloc
                var favorite = document.querySelector(`.diary__bloc.favorites > a[data-id="${trash.dataset.id}"]`);
                favorite.remove();

                // Remove on favorites list
                var liFavorite = document.querySelector(`.favorites__items[data-id="${trash.dataset.id}"]`);
                liFavorite.remove();

                // Remove favorite on database
                const url = `/favorite/delete/${trash.dataset.id}`;
                Axios.get(url).then(function(response) {
                    console.log(url);
                })
            })

            edit.addEventListener('click', event => {
                document.querySelector('.sidebar.right > .widgets').classList.add('active');
                document.querySelector('.sidebar.right div.favorites__form').classList.remove('active');

                Favorite.listenOnChangeTitleInput();
                Favorite.listenOnChangeIconInput();
                Favorite.listenOnChangeUrlInput();

                const url = `/favorite/read-one/${edit.dataset.id}`;
                Axios.get(url).then(function(response) {
                    console.log(response);
                    // Takes form elements
                    var titleInput = document.querySelector('.favorites__form input[name="title"]');
                    var iconInput = document.querySelector('.favorites__form input[name="icon"]');
                    var linkInput = document.querySelector('.favorites__form input[name="link"]');

                    var data = response.data.favorite;
                    // Set dataset Id like response
                    titleInput.dataset.id = edit.dataset.id;
                    iconInput.dataset.id = edit.dataset.id;
                    linkInput.dataset.id = edit.dataset.id;

                    // Set content on dataset content
                    titleInput.dataset.content = data.title;
                    iconInput.dataset.content = data.data.icon;
                    linkInput.dataset.content = data.data.url;
                    
                    //Set content like response
                    titleInput.value = data.title;
                    iconInput.value = data.data.icon;
                    linkInput.value = data.data.url;
                })
            })
        })
    }

    listenOnClickAbandon(abandon) {
        abandon.addEventListener('click', event => {
            event.preventDefault();
        
            document.querySelector('.sidebar.right > .widgets').classList.remove('active');
            document.querySelector('.sidebar.right div.favorites__form').classList.add('active');

            var id = document.querySelector('.favorites__form input[name="link"]').dataset.id; 

            // We reset the content of the widget to its origin (because it changed with the keypress)
            var title = document.querySelector('.favorites__form input[name="title"]').dataset.content;
            var icon = document.querySelector('.favorites__form input[name="icon"]').dataset.content;
            var link = document.querySelector('.favorites__form input[name="link"]').dataset.content;

            var liTitle = document.querySelector(`.favorites__items[data-id="${id}"] span`);
            var favoriteA = document.querySelector(`.diary__bloc.favorites a[data-id="${id}"]`);
            var favoriteImg = document.querySelector(`.diary__bloc.favorites a[data-id="${id}"] img`);

            liTitle.innerHTML = title;
            favoriteA.href = link;
            favoriteImg.src = icon;
        })
    }

    listenOnClickPersist(persist) {
        persist.addEventListener('click', event => {
            event.preventDefault();
            
            document.querySelector('.sidebar.right > .widgets').classList.remove('active');
            document.querySelector('.sidebar.right div.favorites__form').classList.add('active');

            var id = document.querySelector('.favorites__form input[name="link"]').dataset.id; 

            // Get all elements
            var title = document.querySelector('.favorites__form input[name="title"]').value;
            var icon = document.querySelector('.favorites__form input[name="icon"]').value;
            var link = document.querySelector('.favorites__form input[name="link"]').value;

            // Set an array, transform to json and encode it for pass JSON in URL
            var data = {
                icon : icon,
                url : link
            };
            
            // Update data of current widget
            const url = `/favorite/update/${id}/${this.capitalizeFirstLetter(title)}/${encodeURIComponent(window.btoa(JSON.stringify(data)))}`;
            Axios.get(url).then(function() {})
        })
    }

    static listenOnChangeTitleInput() {
        var input = document.querySelector('.favorites__form input[name="title"]');
        input.addEventListener('input', function () {
            var liTitle = document.querySelector(`.favorites__items[data-id="${input.dataset.id}"] span`);
            liTitle.innerHTML = input.value;
        });
    }

    static listenOnChangeIconInput() {
        var input = document.querySelector('.favorites__form input[name="icon"]');
        input.addEventListener('input', function () {  
            var favoriteImg = document.querySelector(`.diary__bloc.favorites a[data-id="${input.dataset.id}"] img`);
            favoriteImg.src = input.value;
        });
    }

    static listenOnChangeUrlInput() {
        var input = document.querySelector('.favorites__form input[name="link"]');
        input.addEventListener('input', function () {  
            var favoriteA = document.querySelector(`.diary__bloc.favorites a[data-id="${input.dataset.id}"]`);
            favoriteA.href = input.value;
        });
    }

    /**
     * Open popup
     */
    openPopup() {
        this.favoritesPopup.classList.add('active');
    }

    /**
     * Close popup
     */
    closePopup() {
        this.favoritesPopup.classList.remove('active');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}