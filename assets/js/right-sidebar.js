export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.rightSidebarCollapse = rightSidebarCollapse;

            if(this.rightSidebarCollapse) {
                this.listenOnClickCollapse();
            }
        }
    }

    listenOnClickCollapse() {
        this.rightSidebarCollapse.addEventListener('click', event => {
            this.rightSidebar.classList.toggle('active');
            console.log(event);
        });
    }
}