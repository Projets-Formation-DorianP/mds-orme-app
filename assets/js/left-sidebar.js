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
                
                if(button.classList.contains('left')) {
                    list = document.querySelector('.sidebar.right .widgets__list.left');
                }else if(button.classList.contains('right')) {
                    list = document.querySelector('.sidebar.right .widgets__list.right');
                }else {
                    // Nothing to do Headers...
                }

                var url = `/diary/${button.dataset.pageNumber}/widget/create/${this.currentWidget.dataset.type}`;

                Axios.get(url).then(function(response) {  
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