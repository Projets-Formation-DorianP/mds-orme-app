import Axios from "axios";
import RightSidebar from "./right-sidebar";

export default class LeftSidebar {
    constructor(leftSidebar, leftSidebarCollapse, leftSidebarWidgets, popup, popupClose, popupButtons, rightListWidgets) {
        this.leftSidebar = leftSidebar;
        this.popup = popup;
        this.rightListWidgets = rightListWidgets;

        if(this.leftSidebar) {
            this.leftSidebarCollapse = leftSidebarCollapse;
            this.leftSidebarWidgets = leftSidebarWidgets;

            if(this.popup) {
                this.popupButtons = popupButtons;
                this.popupClose = popupClose;

                if(this.popupButtons) {
                    this.listenOnClickPopup();
                }

                if(this.popupClose) {
                    this.popupClose.addEventListener('click', event => {
                        event.preventDefault();
                        this.closePopup();
                    })
                }
            }

            if(this.leftSidebarCollapse) {
                this.listenOnClickCollapse();
            }

            if(this.leftSidebarWidgets) {
                this.listenOnClickWidgets(this.leftSidebarWidgets);
            }
        }
    }

    /**
     * Listen to a click on collapse
     */
    listenOnClickCollapse() {
        this.leftSidebarCollapse.addEventListener('click', event => {
            event.preventDefault();
            this.leftSidebar.classList.toggle('active');
        });
    }

    /**
     * Listen to a click on all type of widget
     * 
     * @param {array} widgets 
     */
    listenOnClickWidgets(widgets) {
        widgets.map((widget) => {
            widget.addEventListener('click', event => {
                event.preventDefault();
                this.openPopup();
                this.currentWidget = widget;
            })
        })
    }

    /**
     * Listen to a click on popup
     */
    listenOnClickPopup() {
        this.popupButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                var list = null;
                var page = null;
                
                // Takes the right page and the right list depending on the user's choice
                if(button.classList.contains('left')) {
                    list = document.querySelector('.sidebar.right .widgets__list.left');
                    page = document.querySelector('.diary__bloc.left');
                }else if(button.classList.contains('right')) {
                    list = document.querySelector('.sidebar.right .widgets__list.right');
                    page = document.querySelector('.diary__bloc.right');
                }else {
                    // Nothing to do here...
                }

                var url = `/diary/${button.dataset.pageNumber}/widget/create/${this.currentWidget.dataset.type}`;
                Axios.get(url).then(function(response) {  
                    // Create widget on page
                    if(response.data.widgetType === "text") {
                        var divWidget = document.createElement('div');
                        divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                        divWidget.style.position = 'relative';
                        divWidget.style.top = response.data.widgetPositionTop + "px";
                        divWidget.style.left = response.data.widgetPositionLeft + "px";
                        divWidget.dataset.id = response.data.widgetId;
                        divWidget.dataset.type = response.data.widgetType;
                        
                        // Creates an HTML element according to the string contained in the database
                        let widgetHtmlContent = document.createRange().createContextualFragment(response.data.widgetContent);
    
                        divWidget.appendChild(widgetHtmlContent);
                        RightSidebar.setMouseEnterAndLeaveOnItemAndWidget(divWidget);

                        page.appendChild(divWidget);
    
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

                    // Create element on list
                    var span = document.createElement("span");
                    span.textContent = "Widget: " + response.data.widgetType;

                    var div = document.createElement("div");
                    div.classList.add('widgets__items-infos');

                    var actionsTrash = document.createElement("div");
                    actionsTrash.classList.add('trash');
                    actionsTrash.dataset.id = response.data.widgetId;

                    var actionsA = document.createElement("a");
                    actionsA.href = "#";

                    var actionsModify = document.createElement("div");
                    actionsModify.classList.add('modify');
                    actionsModify.dataset.id = response.data.widgetId;

                    var actionsB = document.createElement("a");
                    actionsB.href = "#";

                    var actionsDiv = document.createElement("div");
                    actionsDiv.classList.add('widgets__items-actions');

                    var li = document.createElement("li");
                    li.classList.add('widgets__items');
                    li.dataset.id = response.data.widgetId;
                    li.dataset.type = response.data.widgetType;

                    div.appendChild(span);
                    actionsA.appendChild(actionsTrash);
                    actionsB.appendChild(actionsModify);
                    actionsDiv.appendChild(actionsA);
                    actionsDiv.appendChild(actionsB);
                    li.appendChild(div);
                    li.appendChild(actionsDiv)

                    LeftSidebar.setMouseEnterAndLeaveOnItemAndWidget(li);
                    list.appendChild(li);
                
                    RightSidebar.setListenOnClickEdit(actionsModify);
                    RightSidebar.setListenOnClickTrash(actionsTrash);
                })

                this.closePopup();
            })
        });
    }

    /**
     * Open popup
     */
    openPopup() {
        this.popup.classList.add('active');
    }

    /**
     * Close popup
     */
    closePopup() {
        this.popup.classList.remove('active');
    }

    /**
     * Listen to a mouseenter and mouseleave on item
     * 
     * @param {elt} li 
     */
    static setMouseEnterAndLeaveOnItemAndWidget(li) {
        li.addEventListener('mouseenter', event => {                
            var div = document.querySelector(`.diary__widget[data-id="${li.dataset.id}"]`);

            li.style.textDecoration = 'underline';
            div.style.border = '1px solid red';
        }),
        li.addEventListener('mouseleave', event => {
            var div = document.querySelector(`.diary__widget[data-id="${li.dataset.id}"]`);

            li.style.textDecoration = 'none';
            div.style.border = '1px solid #F1F3F7';
        });
    }
}