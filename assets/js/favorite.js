import Axios from "axios";

export default class Favorite {
    constructor(favoritesBloc, favoritesSidebarList, favoritesAdd, favoritesEdit, favoritesTrash, favoritesPopup, favoritesPopupClose, favoritesPopupChoices) {
        this.favoritesBloc = favoritesBloc;
        this.favoritesSidebarList = favoritesSidebarList;
        this.favoritesEdit = favoritesEdit;
        this.favoritesTrash = favoritesTrash;
        this.favoritesPopup = favoritesPopup;

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
    }

    listenOnClickFavoritesAdd(add) {
        add.addEventListener('click', event => {
            event.preventDefault();
            this.openPopup();
        })
    }

    listenOnClickFavoritesEdit() {

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
                var src     = "https://image.flaticon.com/icons/svg/1384/1384005.svg"
                break;
            case 'instagram':
                var href    = "https://www.instagram.com/";
                var src     = "https://image.flaticon.com/icons/svg/1384/1384031.svg"
                break;
            case 'twitter':
                var href    = "https://twitter.com/twitter";
                var src     = "https://image.flaticon.com/icons/svg/1384/1384017.svg"
                break;
            case 'reddit':
                var href    = "https://www.reddit.com/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111791.svg"
                break;
            case 'youtube':
                var href    = "https://www.youtube.com/";
                var src     = "https://image.flaticon.com/icons/svg/1384/1384028.svg"
                break;
            case 'spotify':
                var href    = "https://www.spotify.com/fr/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111685.svg"
                break;  
            case 'deezer':
                var href    = "https://www.deezer.com/fr/";
                var src     = "https://image.flaticon.com/icons/svg/49/49383.svg"
                break;   
            case 'gmail':
                var href    = "https://mail.google.com/";
                var src     = "https://image.flaticon.com/icons/svg/60/60543.svg"
                break;   
            case 'airbnb':
                var href    = "https://www.airbnb.fr/";
                var src     = "https://image.flaticon.com/icons/svg/2111/2111307.svg"
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

        // Create new favorite on favorites bloc
        var img = document.createElement('img');
        img.src = src;

        var div = document.createElement('div');
        div.classList.add('item', 'orme');

        var a = document.createElement('a');
        a.href = href;

        div.appendChild(img);
        a.appendChild(div);
        this.favoritesBloc.insertBefore(a, this.favoritesAdd);

        // Create new favorite on favorites list
        var span = document.createElement('span');
        span.innerHTML = this.capitalizeFirstLetter(favorite);

        var div = document.createElement('div');
        div.classList.add('favorites__items-infos');

        var trash = document.createElement('div');
        trash.classList.add('favorites__trash');

        var aTrash = document.createElement('a');
        aTrash.href = '#';

        var edit = document.createElement('div');
        edit.classList.add('favorites__modify');

        var aEdit = document.createElement('a');
        aEdit.href = '#';

        var divActions = document.createElement('div');
        divActions.classList.add('favorites__items-actions');

        var li = document.createElement('li');
        li.classList.add('favorites__items');

        div.appendChild(span);
        aTrash.appendChild(trash);
        aEdit.appendChild(edit);
        divActions.appendChild(aTrash);
        divActions.appendChild(aEdit);
        li.appendChild(div);
        li.appendChild(divActions);
        this.favoritesSidebarList.appendChild(li);

        // Create new favorite on database
        var data = {
            icon : src,
            url : href
        };

        console.log(this.capitalizeFirstLetter(favorite), encodeURIComponent(window.btoa(JSON.stringify(data))));

        const url = `/favorite/create/${this.capitalizeFirstLetter(favorite)}/${encodeURIComponent(window.btoa(JSON.stringify(data)))}`;
        Axios.get(url).then(function(response) {
            console.log(url);
        })
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