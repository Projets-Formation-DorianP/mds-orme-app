import Axios from "axios";

export default class Navigation {
    constructor(navigationArrows, navigationInput) {
        this.navigationArrows = navigationArrows;
        this.navigationInput = navigationInput;

        if(this.navigationArrows) {
            this.listenOnClickArrows(this.navigationArrows);
        }

        if(this.navigationInput) {
            this.listenOnEnterInput(this.navigationInput);
        }
    }

    listenOnClickArrows(arrows) {
        arrows.map((arrow) => {
            arrow.addEventListener('click', event => {
                event.preventDefault();
                
                if(arrow.classList.contains('left')) {
                    this.onClickLeftArrow(arrow);
                }else if(arrow.classList.contains('right')) {
                    this.onClickRightArrow(arrow);
                }else {
                    // Nothing to do Headers...
                }
            })
        })
    }

    onClickLeftArrow(arrow) {
        var previousPageNumber = arrow.dataset.previousPageNumber;

        if(previousPageNumber === 0) {
            // Nothing to do here
        }else {
            const url = `/diary/${previousPageNumber}`;

            window.location.replace(url);
        }
    }

    onClickRightArrow(arrow) {
        console.log('right');
    }

    listenOnEnterInput(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('input');
            }
        });
    }
}