export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse, divWidgets) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.rightSidebarCollapse = rightSidebarCollapse;
            this.divWidgets = divWidgets;

            if(this.rightSidebarCollapse && this.divWidgets) {
                this.listenOnClickCollapse();
            }
        }
    }

    listenOnClickCollapse() {
        this.rightSidebarCollapse.addEventListener('click', event => {
            this.rightSidebar.classList.toggle('active');
            this.divWidgets.classList.toggle('active');
            console.log(event);
        });
    }
}