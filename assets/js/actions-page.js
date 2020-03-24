import Axios from "axios";

export default class ActionsPage {
    constructor(navigationArrows, navigationInput, createPages, diaryLeftPage, diaryRightPage) {
        this.navigationArrows = navigationArrows;
        this.navigationInput = navigationInput;
        this.createPages = createPages;
        this.diaryLeftPage = diaryLeftPage;
        this.diaryRightPage = diaryRightPage;

        if(this.diaryLeftPage && this.diaryRightPage) {
            this.loadCurrentsPageWidgets(this.diaryLeftPage, this.diaryRightPage);
        }

        if(this.navigationArrows) {
            this.listenOnClickArrows(this.navigationArrows);
        }

        if(this.navigationInput) {
            this.listenOnEnterInput(this.navigationInput);
        }

        if(this.createPages) {
            this.listenOnClickCreatePages();
        }
    }

    loadCurrentsPageWidgets(leftPage, rightPage) {
        var pageNumber = parseInt(this.diaryLeftPage.dataset.pageNumber);

        const url = `/page/widgets/${pageNumber}`;
        
        Axios.get(url).then(function(response) {  
            var firstPageWidgets = response.data.widgets.firstPage;
            var secondPageWidgets = response.data.widgets.secondPage;

            firstPageWidgets.forEach(widget => {
                if(widget.type === "text") {
                    var divWidget = document.createElement('div');

                    divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                    divWidget.style.position = 'relative';
                    divWidget.dataset.id = widget.id;
                    divWidget.dataset.type = widget.type;
                    
                    let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent);

                    divWidget.appendChild(widgetHtmlContent);
                    leftPage.appendChild(divWidget);

                    $( ".diary__widget" ).draggable({ 
                        containment: "parent", 
                        scroll: false
                        // stop: function(event) {
                        //     var l = ( 100 * parseFloat($(this).position().left / parseFloat($(this).parent().width())) ) + "%" ;
                        //     var t = ( 100 * parseFloat($(this).position().top / parseFloat($(this).parent().height())) ) + "%" ;
                        //     console.log(l, t);
                        // }
                    });
                }  
            });

            secondPageWidgets.forEach(widget => {
                if(widget.type === "text") {
                    var divWidget = document.createElement('div');

                    divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                    divWidget.style.position = 'relative';
                    divWidget.dataset.id = widget.id;
                    divWidget.dataset.type = widget.type;
                    
                    let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent);

                    divWidget.appendChild(widgetHtmlContent);
                    rightPage.appendChild(divWidget);

                    $( ".diary__widget" ).draggable({ 
                        containment: "parent", 
                        scroll: false
                    });
                }  
            });
        })
    }

    listenOnClickCreatePages() {
        this.createPages.addEventListener('click', event => {
            event.preventDefault();

            const urlCreateNewPages= '/page/create';
            
            Axios.get(urlCreateNewPages).then(function(response) {  
                if(response.data.pagesCreated) {
                    const lastUrlRedirect = '/diary/';
                    window.location.replace(lastUrlRedirect);
                }else {
                    // Nothing to do here..
                }
            })   
        })
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
            if(response.data.nbPages < nextPageNumber) {
                // Nothing to do here..
            }else {
                const urlRedirect = `/diary/${nextPageNumber}`;
                window.location.replace(urlRedirect);
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
    
    openPopup() {
        this.popupCreate.classList.add('active');
    }

    closePopup() {
        this.popupCreate.classList.remove('active');
    }
}