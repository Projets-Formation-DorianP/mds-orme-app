import Axios from "axios";
import RightSidebar from "./right-sidebar";

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

    /**
     * Load active widgets on this page
     * 
     * @param {int} leftPage 
     * @param {int} rightPage 
     */
    loadCurrentsPageWidgets(leftPage, rightPage) {
        var pageNumber = parseInt(this.diaryLeftPage.dataset.pageNumber);

        const url = `/page/widgets/${pageNumber}`;
        // Will retrieve the active widgets on the requested page as well as on the sister page
        Axios.get(url).then(function(response) {
            var widgets = Object.values(response.data.widgets);
            widgets.forEach(page => {
                page.forEach(widget => {
                    if(widget.type === "text") {
                        var divWidget = document.createElement('div');
                        divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                        divWidget.style.position = 'relative';
                        divWidget.style.top = widget.top + "px";
                        divWidget.style.left = widget.left + "px";
                        divWidget.dataset.id = widget.id;
                        divWidget.dataset.type = widget.type;
                        divWidget.dataset.lastLeftPosition = widget.left;
                        
                        // Creates an HTML element according to the string contained in the database
                        let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent);

                        divWidget.appendChild(widgetHtmlContent);

                        var divWidgetParagraph = divWidget.firstChild;

                        // Set data
                        if(widget.data.fullWidth === "checked") {
                            divWidget.style.maxWidth = 'none';
                            divWidget.style.left = null;
                        } 
                        divWidgetParagraph.style.fontSize = widget.data.size + 'px';
                        divWidgetParagraph.style.color = widget.data.color;
                        widget.data.bold === "checked" ? divWidgetParagraph.style.fontWeight = "bold" : '';
                        widget.data.italic === "checked" ? divWidgetParagraph.style.fontStyle = "italic" : '';
                        widget.data.underline === "checked" ? divWidgetParagraph.style.textDecoration = "underline" : '';
                        divWidgetParagraph.style.textAlign = widget.data.textAlign;
                        
                        if(widget.data.highlight === "checked") {
                            if(widget.data.highlight === "#000000") {
                                divWidgetParagraph.style.backgroundColor = "rgba(255,255,0,0.3)";
                            }else {
                                divWidgetParagraph.style.backgroundColor = RightSidebar.hexToRGB(widget.data.highlightColor, 0.3);
                            }
                        }

                        // Add event listener mouseenter and mouseleave
                        divWidget.addEventListener('mouseenter', event => {                
                            var li = document.querySelector(`.widgets__items[data-id="${divWidget.dataset.id}"]`);
                
                            li.style.textDecoration = 'underline';
                            divWidget.style.border = '1px solid red';
                        }),
                        divWidget.addEventListener('mouseleave', event => {
                            var li = document.querySelector(`.widgets__items[data-id="${divWidget.dataset.id}"]`);
                
                            li.style.textDecoration = 'none';
                            divWidget.style.border = '1px solid #F1F3F7';
                        })

                        // Add widget to the good page
                        widget.pageNumber === parseInt(leftPage.dataset.pageNumber) ? leftPage.appendChild(divWidget) : rightPage.appendChild(divWidget);    
                        
                        //Set draggable on widget
                        $( ".diary__widget" ).draggable({ 
                            cursor: "grabbing",
                            containment: "parent", 
                            scroll: false,
                            stop: function(event) {
                                var id = this.dataset.id;
                                var top = this.style.top.replace('px','');
                                var left = this.style.left.replace('px','');

                                const url = `/diary/widget/positions/${id}/${top}/${left}`;
                                Axios.get(url).then(function() {})
                            }
                        });
                    }  
                })
            })
        })
    }

    /**
     * Put an event listener click on + icon for create new pages
     */
    listenOnClickCreatePages() {
        this.createPages.addEventListener('click', event => {
            event.preventDefault();

            // Call url to create couple of new pages
            const urlCreateNewPages= '/page/create'; 
            Axios.get(urlCreateNewPages).then(function(response) {  
                if(response.data.pagesCreated) {
                    const lastUrlRedirect = '/diary/';
                    window.location.replace(lastUrlRedirect);
                }
            })   
        })
    }

    /**
     * Put an event listener click on all arrows for navigate between pages
     * 
     * @param {elt} arrows 
     */
    listenOnClickArrows(arrows) {
        arrows.map((arrow) => {
            arrow.addEventListener('click', event => {
                event.preventDefault();

                arrow.classList.contains('left') ? this.onClickLeftArrow(arrow) : (arrow.classList.contains('right') ? this.onClickRightArrow(arrow) : '');
            })
        })
    }

    /**
     * Navigate to the previous page
     * 
     * @param {elt} arrow 
     */
    onClickLeftArrow(arrow) {
        var previousPageNumber = parseInt(arrow.dataset.previousPageNumber);

        if(previousPageNumber !== 0) {
            const url = `/diary/${previousPageNumber}`;
            window.location.replace(url);
        }
    }

    /**
     * Navigate to the previous page
     * 
     * @param {elt} arrow 
     */
    onClickRightArrow(arrow) {
        var nextPageNumber = parseInt(arrow.dataset.nextPageNumber);
        const url = `/page/how-many`;

        Axios.get(url).then(function(response) {  
            if(response.data.nbPages >= nextPageNumber) {
                const urlRedirect = `/diary/${nextPageNumber}`;
                window.location.replace(urlRedirect);
            }
        })
    }

    /**
     * Add event listener keypress on input
     * 
     * @param {elt} input 
     */
    listenOnEnterInput(input) {
        input.addEventListener('keypress', function (e) {
            if(e.key === 'Enter') {
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