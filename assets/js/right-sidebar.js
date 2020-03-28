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

        // Set event listener on all form elements
        this.listenOnKeyPressTextArea();
        this.listenOnChangeFullWidthCheckbox();
        this.listenOnValueChangeSizeInput();
        this.listenOnValueChangeColorInput();
        this.listenOnChangeTextFormattingCheckbox();
        this.listenOnChangeHighlightCheckboxAndHighlightColorInput();

        // Set event listener on two buttons
        this.abandon ? this.listenOnClickAbandon() : '';
        this.persist ? this.listenOnClickPersist() : '';        
    }

    /**
     * Listen to all key press for update widget content in real time
     */
    listenOnKeyPressTextArea() {
        var htmlContentTextarea = document.querySelector('.widgets__form.text textarea');    
        htmlContentTextarea.addEventListener('keypress', event => {
            var content = htmlContentTextarea.value; 
            // If the key is a letter or a number, then we add it directly to the content
            (/[a-zA-Z0-9-_ ]/.test(event.key)) ? content = content + event.key : '';

            var id = htmlContentTextarea.dataset.id;
            var diaryWidget = document.querySelector(`.diary__widget[data-id="${id}"] p`);
            
            diaryWidget.innerHTML = content;
        })
    }

    /**
     * Listen to a change on the full width checkbox
     */
    listenOnChangeFullWidthCheckbox() {
        var fullWidthCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="full-width"]');
        var flag = true;

        fullWidthCheckbox.addEventListener('change', function() {
            var associatedWidget = document.querySelector(`.diary__widget[data-id="${fullWidthCheckbox.dataset.id}"]`);
            if(flag) {
                associatedWidget.dataset.lastLeftPosition = associatedWidget.style.left.replace('px', '');
                flag = false;
            }

            if(this.checked) {
                associatedWidget.style.left = null;
                associatedWidget.style.maxWidth = 'none';
            } else {
                associatedWidget.style.left = associatedWidget.dataset.lastLeftPosition + 'px';
                associatedWidget.style.maxWidth = '250px';
                flag = true;
            }
        });
    }

    /**
     * Listen to a change on the size input
     */
    listenOnValueChangeSizeInput() {
        var sizeInput = document.querySelector('.widgets__form.text input[type="number"][name="size"]');
        sizeInput.addEventListener('input', function () {
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${sizeInput.dataset.id}"] p`);

            var size = sizeInput.value + 'px';

            if(size == null) {
                associatedWidgetParagraph.style.fontSize = '1rem';
            }else {
                associatedWidgetParagraph.style.fontSize = size;
            } 
        });
    }

    /**
     * Listen to a change on the color input
     */
    listenOnValueChangeColorInput() {
        var colorInput = document.querySelector('.widgets__form.text input[type="color"][name="color"]');
        colorInput.addEventListener('input', function (event) {
            var color = colorInput.value;
            
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${colorInput.dataset.id}"] p`);
            associatedWidgetParagraph.style.color = color;
        });
    }

    /**
     * Listen to a change on all the text formatting options
     */
    listenOnChangeTextFormattingCheckbox() {
        var boldCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="bold"]');
        var italicCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="italic"]');
        var underlineCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="underline"]');

        boldCheckbox.addEventListener('change', function() {
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${boldCheckbox.dataset.id}"] p`);

            if(this.checked) {
                associatedWidgetParagraph.style.fontWeight = "bold";
            } else {
                associatedWidgetParagraph.style.fontWeight = "normal";
            }
        })

        italicCheckbox.addEventListener('change', function() {
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${italicCheckbox.dataset.id}"] p`);
            
            if(this.checked) {
                associatedWidgetParagraph.style.fontStyle = "italic";
            } else {
                associatedWidgetParagraph.style.fontStyle = null;
            }
        })

        underlineCheckbox.addEventListener('change', function() {
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${underlineCheckbox.dataset.id}"] p`);

            if(this.checked) {
                associatedWidgetParagraph.style.textDecoration = "underline";
            } else {
                associatedWidgetParagraph.style.textDecoration = "none";
            }
        })
    }

    /**
     * Listen to a change on highlight checkbox and highlight color input
     */
    listenOnChangeHighlightCheckboxAndHighlightColorInput() {
        var divHighlight = document.querySelector('.highlight-color.active');
        var highlightCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="highlight"]');
        var highlightColorInput = document.querySelector('.widgets__form.text input[type="color"][name="highlight-color"]');

        highlightCheckbox.addEventListener('change', function() {  
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${highlightCheckbox.dataset.id}"] p`);          

            if(this.checked) {
                divHighlight.classList.remove('active');
                associatedWidgetParagraph.style.backgroundColor = "rgba(255,255,0,0.3)";
            } else {
                divHighlight.classList.add('active');
                associatedWidgetParagraph.style.backgroundColor = "";
                highlightColorInput.value = "";
            }
        })

        highlightColorInput.addEventListener('input', function (event) {
            var associatedWidgetParagraph = document.querySelector(`.diary__widget[data-id="${highlightColorInput.dataset.id}"] p`);
            var color = RightSidebar.hexToRGB(highlightColorInput.value, 0.3);

            associatedWidgetParagraph.style.backgroundColor = color;
        });
    }

    /**
     * Listen to a click on the button to abandon the modification linked to the widget modification form
     */
    listenOnClickAbandon() {   
        this.abandon.addEventListener('click', event => {
            this.divWidgets.classList.remove('active');
            this.formContentRightSidebar.classList.add('active');

            // Reset value of text area 
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
        // Get all elements
        var htmlContent = document.querySelector('.widgets__form.text textarea').value;
        var fullWidthCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="full-width"]');
        var sizeInput = document.querySelector('.widgets__form.text input[type="number"][name="size"]');
        var colorInput = document.querySelector('.widgets__form.text input[type="color"][name="color"]');
        var boldCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="bold"]');
        var italicCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="italic"]');
        var underlineCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="underline"]');
        var highlightCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="highlight"]');
        var highlightColorInput = document.querySelector('.widgets__form.text input[type="color"][name="highlight-color"]');

        // Encode the html content to make it "transportable" in the url
        var dataHtmlContent = encodeURIComponent(window.btoa(htmlContent));

        // Get content of all elements
        var fullWidthCheckboxContent = fullWidthCheckbox.checked ? "checked" : null;
        var sizeInputContent = sizeInput.value == "" ? "16" : sizeInput.value;
        var colorInputContent = colorInput.value;
        var boldCheckboxContent = boldCheckbox.checked ? "checked" : null;
        var italicCheckboxContent = italicCheckbox.checked ? "checked" : null;
        var underlineCheckboxContent = underlineCheckbox.checked ? "checked" : null;
        var highlightCheckboxContent = highlightCheckbox.checked ? "checked" : null;
        var highlightColorInputContent = highlightColorInput.value;

        // Set an array, transform to json and encode it for pass JSON in URL
        var arrayData = {
            fullWidth       : fullWidthCheckboxContent,
            size            : sizeInputContent,
            color           : colorInputContent,
            bold            : boldCheckboxContent,
            italic          : italicCheckboxContent,
            underline       : underlineCheckboxContent,
            highlight       : highlightCheckboxContent,
            highlightColor  : highlightColorInputContent
        };

        var dataJson = encodeURIComponent(window.btoa(JSON.stringify(arrayData)));
        console.log(dataJson);
        
        // Update data of current widget
        var url = `/diary/widget/update/${id}/${dataHtmlContent}/${dataJson}`;
        Axios.get(url).then(function() {})

        // Return to the list of widgets
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
            console.log(response.data);
            // Takes content without HTML tags from response
            var content = response.data.response.htmlContent.replace('<p>', '').replace('</p>', '');     
             
            // Takes form elements
            var htmlContentTextarea = document.querySelector('.widgets__form.text textarea');  
            var fullWidthCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="full-width"]');
            var sizeInput = document.querySelector('.widgets__form.text input[type="number"][name="size"]');
            var colorInput = document.querySelector('.widgets__form.text input[type="color"][name="color"]');
            var boldCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="bold"]');
            var italicCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="italic"]');
            var underlineCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="underline"]');
            var highlightCheckbox = document.querySelector('.widgets__form.text input[type="checkbox"][name="highlight"]');
            var highlightColorInput = document.querySelector('.widgets__form.text input[type="color"][name="highlight-color"]');

            // Set dataset Id like response
            htmlContentTextarea.dataset.id = edit.dataset.id;
            fullWidthCheckbox.dataset.id = edit.dataset.id;
            sizeInput.dataset.id = edit.dataset.id;
            colorInput.dataset.id = edit.dataset.id;
            boldCheckbox.dataset.id = edit.dataset.id;
            italicCheckbox.dataset.id = edit.dataset.id;
            underlineCheckbox.dataset.id = edit.dataset.id;
            highlightCheckbox.dataset.id = edit.dataset.id;
            highlightColorInput.dataset.id = edit.dataset.id;

            //Set content like response
            htmlContentTextarea.dataset.content = encodeURIComponent(window.btoa(content));
            htmlContentTextarea.value = content; 
            
            var data = response.data.response.data;
            data.fullWidth === "checked" ? fullWidthCheckbox.checked = true : '';
            sizeInput.value = data.size;
            colorInput.value = data.color;
            data.bold === "checked" ? boldCheckbox.checked = true : '';
            data.italic === "checked" ? italicCheckbox.checked = true : '';
            data.underline === "checked" ? underlineCheckbox.checked = true : '';
            data.highlight === "checked" ? highlightCheckbox.checked = true : '';
            highlightColorInput.value = data.highlightColor;
        })
    }

    static hexToRGB(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
    
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
}
