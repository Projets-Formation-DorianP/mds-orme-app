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

    listenOnClickCollapse() {
        this.leftSidebarCollapse.addEventListener('click', event => {
            event.preventDefault();
            this.leftSidebar.classList.toggle('active');
        });
    }

    listenOnClickWidgets(widgets) {
        widgets.map((widget) => {
            widget.addEventListener('click', event => {
                event.preventDefault();
                this.openPopup();
                this.currentWidget = widget;
            })
        })
    }

    listenOnClickPopup() {
        this.popupButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                var list = null;
                var page = null;
                
                if(button.classList.contains('left')) {
                    list = document.querySelector('.sidebar.right .widgets__list.left');
                    page = document.querySelector('.diary__bloc.left');
                }else if(button.classList.contains('right')) {
                    list = document.querySelector('.sidebar.right .widgets__list.right');
                    page = document.querySelector('.diary__bloc.right');
                }else {
                    // Nothing to do Headers...
                }

                var url = `/diary/${button.dataset.pageNumber}/widget/create/${this.currentWidget.dataset.type}`;

                Axios.get(url).then(function(response) {  
                    /**
                     * Create element on page
                     */
                    if(response.data.widgetType === "text") {
                        var divWidget = document.createElement('div');
    
                        divWidget.classList.add('diary__widget', 'ui-widget-content', 'ui-draggable' , 'ui-draggable-handle');
                        divWidget.style.position = 'relative';
                        divWidget.style.top = response.data.widgetPositionTop + "px";
                        divWidget.style.left = response.data.widgetPositionLeft + "px";
                        divWidget.dataset.id = response.data.widgetId;
                        divWidget.dataset.type = response.data.widgetType;
                        
                        let widgetHtmlContent = document.createRange().createContextualFragment(response.data.widgetContent);
    
                        divWidget.appendChild(widgetHtmlContent);
                        divWidget.addEventListener('mouseenter', event => {                
                            var li = document.querySelector(`.widgets__items[data-id="${response.data.widgetId}"]`);
            
                            li.style.textDecoration = 'underline';
                            divWidget.style.border = '1px solid red';
                        }),
                        divWidget.addEventListener('mouseleave', event => {
                            var li = document.querySelector(`.widgets__items[data-id="${response.data.widgetId}"]`);
            
                            li.style.textDecoration = 'none';
                            divWidget.style.border = '1px solid #F1F3F7';
                        });

                        page.appendChild(divWidget);
    
                        $( ".diary__widget" ).draggable({ 
                            cursor: "grabbing",
                            containment: "parent", 
                            scroll: false,
                            stop: function(event) {
                                var id = this.dataset.id;
                                var top = this.style.top.replace('px','');
                                var left = this.style.left.replace('px','');
                                console.log(top, left);
                            
                                const url = `/diary/widget/positions/${id}/${top}/${left}`;
    
                                Axios.get(url).then(function() {})
                            }
                        });
                    }  

                    /**
                     * Create element on list
                     */
                    var span = document.createElement("span");
                    span.textContent = "Widget: " + response.data.widgetType;

                    var div = document.createElement("div");
                    div.classList.add('widgets__items-infos');

                    var actionsTrash = document.createElement("div");
                    actionsTrash.classList.add('trash');
                    actionsTrash.dataset.id = response.data.widgetId;

                    var actionsA = document.createElement("a");
                    actionsA.href = "#";

                    var actionsDiv = document.createElement("div");
                    actionsDiv.classList.add('widgets__items-actions');

                    var li = document.createElement("li");
                    li.classList.add('widgets__items');
                    li.dataset.id = response.data.widgetId;
                    li.dataset.type = response.data.widgetType;

                    div.appendChild(span);
                    actionsA.appendChild(actionsTrash);
                    actionsDiv.appendChild(actionsA);
                    li.appendChild(div);
                    li.appendChild(actionsDiv)

                    li.addEventListener('mouseenter', event => {                
                        var div = document.querySelector(`.diary__widget[data-id="${response.data.widgetId}"]`);
        
                        li.style.textDecoration = 'underline';
                        div.style.border = '1px solid red';
                    }),
                    li.addEventListener('mouseleave', event => {
                        var div = document.querySelector(`.diary__widget[data-id="${response.data.widgetId}"]`);
        
                        li.style.textDecoration = 'none';
                        div.style.border = '1px solid #F1F3F7';
                    });

                    list.appendChild(li);
                
                    RightSidebar.setListenOnClickTrash(actionsTrash);
                })

                this.closePopup();
            })
        });
    }

    openPopup() {
        this.popup.classList.add('active');
    }

    closePopup() {
        this.popup.classList.remove('active');
    }
}