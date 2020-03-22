export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse, divWidgets, trash) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.rightSidebarCollapse = rightSidebarCollapse;
            this.divWidgets = divWidgets;
            this.trash = trash;

            if(this.rightSidebarCollapse && this.divWidgets) {
                this.listenOnClickCollapse();
            }

            if(this.trash) {
                this.listenOnClickTrash();
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

    listenOnClickTrash() {
        this.trash.map((trash) => {
            trash.addEventListener('click', event => {
                event.preventDefault();
                // Actions
            })
        })
    }
}