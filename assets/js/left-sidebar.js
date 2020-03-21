export default class LeftSidebar {
    constructor(leftSidebar, leftSidebarCollapse, leftSidebarWidgets) {
        this.leftSidebar = leftSidebar;

        if(this.leftSidebar) {
            this.leftSidebarCollapse = leftSidebarCollapse;
            this.leftSidebarWidgets = leftSidebarWidgets;

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
        console.log(widgets);
        widgets.map((widget) => {
            widget.addEventListener('click', event => {
                event.preventDefault();
                switch (widget.dataset.type) {
                case 'text':
                    console.log('Type : ' + widget.dataset.type);
                    break;
                case 'image':
                    console.log('Type : ' + widget.dataset.type);
                    break;
                case 'to-do':
                    console.log('Type : ' + widget.dataset.type);
                break;
                case 'link':
                    console.log('Type : ' + widget.dataset.type);
                break;
                default:
                    console.log('This type of widget is not recognized : ' + widget.dataset.type);
                }
            })
        })
    }
}