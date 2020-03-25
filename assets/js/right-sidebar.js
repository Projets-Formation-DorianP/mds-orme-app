import Axios from "axios";

export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse, divWidgets, arrayTrash, widgetsList) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.rightSidebarCollapse = rightSidebarCollapse;
            this.divWidgets = divWidgets;
            this.arrayTrash = arrayTrash;
            this.widgetsList = widgetsList;

            if(this.rightSidebarCollapse && this.divWidgets) {
                this.listenOnClickCollapse();
            }

            if(this.arrayTrash) {
                this.listenOnClickTrash();
            }

            if(this.widgetsList) {
                this.listenOnMouseEnterWidgets();
            }
        }
    }

    listenOnClickCollapse() {
        this.rightSidebarCollapse.addEventListener('click', event => {
            this.rightSidebar.classList.toggle('active');
            this.divWidgets.classList.toggle('active');
        });
    }

    listenOnClickTrash() {
        this.arrayTrash.map((trash) => {
            trash.addEventListener('click', event => {
                RightSidebar.clickTrash(trash, event);
            })
        })
    }

    listenOnMouseEnterWidgets() {
        this.widgetsList.map((widget) => {
            widget.addEventListener('mouseenter', event => {                
                var div = document.querySelector(`.diary__widget[data-id="${widget.dataset.id}"]`);

                widget.style.textDecoration = 'underline';
                div.style.border = '1px solid red';
            }),
            widget.addEventListener('mouseleave', event => {
                var div = document.querySelector(`.diary__widget[data-id="${widget.dataset.id}"]`);

                widget.style.textDecoration = 'none';
                div.style.border = '1px solid #F1F3F7';
            })
        })
    }

    static setListenOnClickTrash(trash) {
        trash.addEventListener('click', event => {
            RightSidebar.clickTrash(trash, event);
        })
    }

    static clickTrash(trash, event) {
        event.preventDefault();

        var url = `/diary/widget/delete/${trash.dataset.id}`;

        Axios.get(url).then(function() {})

        var li = trash.closest('li');
        li.remove();

        var divWidget = document.querySelector(`.diary__widget[data-id="${trash.dataset.id}"]`);
        divWidget.remove();
    }
}