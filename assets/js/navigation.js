import Axios from "axios";

export default class Navigation {
    constructor(navigationArrows, navigationInput) {
        this.navigationArrows = navigationArrows;
        this.navigationInput = navigationInput;

        if(this.navigationArrows) {
            this.listenOnClickArrows(this.navigationArrows);
        }

        if(this.navigationInput) {
            this.listenOnEnterInput(this.navigationInput);
        }
    }

    listenOnClickArrows(arrows) {
        arrows.map((arrow) => {
            arrow.addEventListener('click', event => {
                event.preventDefault();
                
                if(arrow.classList.contains('left')) {
                    this.onClickLeftArrow(arrow);
                }else if(arrow.classList.contains('right')) {
                    this.onClickRightArrow(arrow);
                }else {
                    // Nothing to do Headers...
                }
            })
        })
    }

    onClickLeftArrow(arrow) {
        var previousPageNumber = parseInt(arrow.dataset.previousPageNumber);

        if(previousPageNumber === 0) {
            // Nothing to do here..
        }else {
            const url = `/diary/${previousPageNumber}`;

            window.location.replace(url);
        }
    }

    onClickRightArrow(arrow) {
        var nextPageNumber = parseInt(arrow.dataset.nextPageNumber);
        const url = `/page/how-many`;

        Axios.get(url).then(function(response) {  
            if(response.data.nbPages > nextPageNumber) {
                const urlRedirect = `/diary/${nextPageNumber}`;
                window.location.replace(urlRedirect);
            }else {
                const urlCreateNewPages= '/page/create';
                
                Axios.get(urlCreateNewPages).then(function(response) {  
                    if(response.data.pagesCreated) {
                        const lastUrlRedirect = '/diary/';
                        window.location.replace(lastUrlRedirect);
                    }else {
                        // Nothing to do here..
                    }
                })
            }
        })
    }

    listenOnEnterInput(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                var pageNumber = parseInt(input.value);
                
                if(isNaN(pageNumber)) {
                    input.value = "";
                }else{
                    const url = `/page/check/${pageNumber}`;

                    Axios.get(url).then(function(response) {  
                        if(response.data.exists) {
                            const urlRedirect = `/diary/${pageNumber}`;

                            window.location.replace(urlRedirect);
                        }else {
                            input.value = "";
                        }
                    })
                }
            }
        });
    }
}