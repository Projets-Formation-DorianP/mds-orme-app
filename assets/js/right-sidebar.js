export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse, divWidgets, arrayTrash) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.rightSidebarCollapse = rightSidebarCollapse;
            this.divWidgets = divWidgets;
            this.arrayTrash = arrayTrash;

            if(this.rightSidebarCollapse && this.divWidgets) {
                this.listenOnClickCollapse();
            }

            if(this.arrayTrash) {
                this.listenOnClickTrash();
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

    static setListenOnClickTrash(trash) {
        trash.addEventListener('click', event => {
            RightSidebar.clickTrash(trash, event);
        })
    }

    static clickTrash(trash, event) {
        event.preventDefault();
        console.log(trash, event);
    }
}