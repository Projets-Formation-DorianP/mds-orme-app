import Axios from "axios";

export default class RightSidebar {
    constructor(rightSidebar, rightSidebarCollapse, divWidgets, arrayTrash, arrayEdit, widgetsList, formContentRightSidebar, abandon, persist) {
        this.rightSidebar = rightSidebar;

        if(this.rightSidebar) {
            this.formContentRightSidebar = formContentRightSidebar;
            this.rightSidebarCollapse = rightSidebarCollapse;
            this.widgetsList = widgetsList;
            this.divWidgets = divWidgets;
            this.arrayTrash = arrayTrash;
            this.arrayEdit = arrayEdit;
            this.abandon = abandon;
            this.persist = persist;

            if(this.formContentRightSidebar && this.rightSidebarCollapse && this.divWidgets) {
                this.listenOnClickCollapse();
            }

            if(this.arrayTrash && this.arrayEdit) {
                this.listenOnClickTrash();
                this.listenOnClickEdit();
            }

            if(this.widgetsList) {
                this.listenOnMouseEnterWidgets();
            }
        }
    }

    /**
     * Listen to a click on collapse
     */
    listenOnClickCollapse() {
        this.rightSidebarCollapse.addEventListener('click', event => {
            if(!this.formContentRightSidebar.classList.contains('active')) {
                this.formContentRightSidebar.classList.add('active')
                this.rightSidebar.classList.add('active');
                this.divWidgets.classList.add('active');
            }else {
                this.rightSidebar.classList.toggle('active');
                this.divWidgets.classList.toggle('active');
            }
        });
    }

    /**
     * Put an event listener click on all the trash icon
     */
    listenOnClickTrash() {
        this.arrayTrash.map((trash) => {
            trash.addEventListener('click', event => {
                RightSidebar.clickTrash(trash, event);
            })
        })
    }

    /**
     * Put an event listener click on all the edit icon
     */
    listenOnClickEdit() {
        this.arrayEdit.map((edit) => {
            edit.addEventListener('click', event => {
                RightSidebar.clickEdit(edit, event);  
            })  
        })

        this.listenOnKeyPressTextArea();
        this.abandon ? this.listenOnClickAbandon() : '';
        this.persist ? this.listenOnClickPersist() : '';        
    }

    /**
     * Listen to all key press for update widget content in real time
     */
    listenOnKeyPressTextArea() {
        var textarea = document.querySelector('.widgets__form.text textarea');    
        textarea.addEventListener('keypress', event => {
            var content = document.querySelector('.widgets__form.text textarea').value; 
            // If the key is a letter or a number, then we add it directly to the content
            (/[a-zA-Z0-9-_ ]/.test(event.key)) ? content = content + event.key : '';

            var id = textarea.dataset.id;
            var diaryWidget = document.querySelector(`.diary__widget[data-id="${id}"] p`);
            
            diaryWidget.innerHTML = content;
        })
    }

    /**
     * Listen to a click on the button to abandon the modification linked to the widget modification form
     */
    listenOnClickAbandon() {   
        this.abandon.addEventListener('click', event => {
            this.divWidgets.classList.remove('active');
            this.formContentRightSidebar.classList.add('active');

            document.querySelector('.widgets__form.text textarea').value = "";

            // We reset the content of the widget to its origin (because it changed with the keypress)
            var id = document.querySelector('.widgets__form.text textarea').dataset.id; 
            var content = document.querySelector('.widgets__form.text textarea').dataset.content;
            var diaryWidget = document.querySelector(`.diary__widget[data-id="${id}"] p`);
            diaryWidget.innerHTML = decodeURIComponent(window.atob(content));
        })         
    }

    /**
     * Listen to a click on the button to persist the data linked to the widget modification form
     */
    listenOnClickPersist() {
        this.persist.addEventListener('click', event => {
            var textarea = document.querySelector('.widgets__form.text textarea');  
            var id = textarea.dataset.id;  
            var htmlContent = textarea.value;  

            var diaryWidget = document.querySelector(`.diary__widget[data-id="${id}"] p`);
            diaryWidget.innerHTML = htmlContent;

            this.persistFormData(id);
        })  
    }

    /**
     * Updating widget information based on the widget modification form
     * 
     * @param {int} id 
     */
    persistFormData(id) {
        // Encode the content to make it "transportable" in the url
        var htmlContent = document.querySelector('.widgets__form.text textarea').value;
        var dataHtmlContent = encodeURIComponent(window.btoa(htmlContent));
        
        var url = `/diary/widget/update/${id}/${dataHtmlContent}`;
        Axios.get(url).then(function() {})

        this.divWidgets.classList.remove('active');
        this.formContentRightSidebar.classList.add('active');
    }

    /**
     * Add CSS style on mouseenter to match a list item with a widget and vice versa
     */
    listenOnMouseEnterWidgets() {
        this.widgetsList.map((li) => {
            // Add event listener mouseenter and mouseleave
            li.addEventListener('mouseenter', event => {                
                var divWidget = document.querySelector(`.diary__widget[data-id="${li.dataset.id}"]`);
    
                li.style.textDecoration = 'underline';
                divWidget.style.border = '1px solid red';
            }),
            li.addEventListener('mouseleave', event => {
                var divWidget = document.querySelector(`.diary__widget[data-id="${li.dataset.id}"]`);
    
                li.style.textDecoration = 'none';
                divWidget.style.border = '1px solid #F1F3F7';
            })
        })
    }

    /**
     * Put an event listener click on the trash icon
     * 
     * @param {elt} trash 
     */
    static setListenOnClickTrash(trash) {
        trash.addEventListener('click', event => {
            RightSidebar.clickTrash(trash, event);
        })
    }

    /**
     * Trigger actions related to the click on the icon trash
     * 
     * @param {elt} trash 
     * @param {event} event 
     */
    static clickTrash(trash, event) {
        event.preventDefault();

        var url = `/diary/widget/delete/${trash.dataset.id}`;
        Axios.get(url).then(function() {})

        // Remove item from list and widget from diary's page
        trash.closest('li').remove();
        document.querySelector(`.diary__widget[data-id="${trash.dataset.id}"]`).remove();
    }

    /**
     * Put an event listener click on the edit icon
     * 
     * @param {elt} edit 
     */
    static setListenOnClickEdit(edit) {
        edit.addEventListener('click', event => {
            RightSidebar.clickEdit(edit, event);
        })
    }

    /**
     * Trigger actions related to the click on the icon edit
     * 
     * @param {elt} edit 
     * @param {event} event 
     */
    static clickEdit(edit, event) {
        event.preventDefault();
        
        document.querySelector('.sidebar.right > .widgets').classList.add('active');        
        document.querySelector('.sidebar.right div.widgets__form.text').classList.remove('active');

        const url = `/diary/widget/read/${edit.dataset.id}`;
        Axios.get(url).then(function(response) {
            // Takes content without HTML tags from response
            var htmlContent = response.data.response.htmlContent.replace('<p>', '').replace('</p>', '');     
            var textarea = document.querySelector('.widgets__form.text textarea');   

            // Set dataset Id like response, same things for content (base64 encode)
            textarea.dataset.id = edit.dataset.id;
            textarea.dataset.content = encodeURIComponent(window.btoa(htmlContent));
            
            textarea.value = htmlContent;  
        })
    }
}
