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
                    var divWidget = document.createElement('div');
                    divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                    divWidget.style.position = 'relative';
                    divWidget.style.top = widget.top + "px";
                    divWidget.style.left = widget.left + "px";
                    divWidget.dataset.id = widget.id;
                    divWidget.dataset.type = widget.type;
                    divWidget.dataset.lastLeftPosition = widget.left;

                    // Set data and child
                    (widget.type === "text") ? ActionsPage.setDataWidgetText(divWidget, widget) : '';
                    (widget.type === "image") ? ActionsPage.setDataWidgetImage(divWidget, widget) : '';
                    (widget.type === "video") ? ActionsPage.setDataWidgetVideo(divWidget, widget) : '';
                    (widget.type === "todo") ? ActionsPage.setDataWidgetTodo(divWidget, widget) : '';

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
                        cursor: "move",
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
                })
            })
        })
    }

    static setDataWidgetText(divWidget, widget) {
        // Creates an HTML element according to the string contained in the database
        let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent);
        divWidget.appendChild(widgetHtmlContent);

        var divWidgetParagraph = divWidget.firstChild;

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
            if(widget.data.highlight === "#ffff00") {
                divWidgetParagraph.style.backgroundColor = "rgba(255,255,0,0.3)";
            }else {
                divWidgetParagraph.style.backgroundColor = RightSidebar.hexToRGB(widget.data.highlightColor, 0.3);
            }
        }
    }

    static setDataWidgetImage(divWidget, widget) {
        String.prototype.splice = function(idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };

        // Creates an HTML element according to the string contained in the database
        var styleImage = `style="width: ${widget.data.width}px; "`;
        let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent.splice(5, 0, styleImage));

        divWidget.style.transform = `rotate(${parseInt(widget.data.rotate)}deg)`;
        divWidget.style.maxWidth = "none";

        divWidget.appendChild(widgetHtmlContent);    
    }

    static setDataWidgetVideo(divWidget, widget) {
        // Creates an HTML element according to the string contained in the database
        let widgetHtmlContent = document.createRange().createContextualFragment(widget.htmlContent);
        divWidget.appendChild(widgetHtmlContent);
    }

    static setDataWidgetTodo(divWidget, widget) {
        var nbTodo = widget.data.nbTodo;

        var ul = document.createElement('ul');
        ul.classList.add('todo__list');
        var h4 = document.createElement('h4');
        h4.classList.add('todo__title');
        h4.innerHTML = widget.data.title;
        
        let inputs = [];
        for (let index = 0; index < nbTodo; index++) {
            // Construct widget
            var label = document.createElement('label');
            label.classList.add('todo__label');
            label.innerHTML = widget.data.contentTodo[index];
            var input = document.createElement('input');
            input.type = "checkbox";
            input.classList.add('todo__checkbox');
            var span = document.createElement('span');
            span.classList.add('todo__custom-checkbox');
            var li = document.createElement('li');
            li.classList.add('todo__items');
            li.dataset.task = (index+1);

            li.appendChild(span);
            li.appendChild(input);
            li.appendChild(label);

            ul.appendChild(li);

            inputs.push(input);
        }

        inputs.map((elt) => {
            var span = elt.previousSibling;
            var label = elt.nextSibling;
            elt.addEventListener('change', event => {
                elt.checked ? span.classList.add('active') : span.classList.remove('active');
                elt.checked ? label.style.textDecoration = "line-through" : label.style.textDecoration = "none";
            })
        })

        divWidget.appendChild(h4);
        divWidget.appendChild(ul);
        divWidget.style.maxWidth = 'none';
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