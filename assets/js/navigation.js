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
                console.log(arrow);
            })
        })
    }

    listenOnEnterInput(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log(input);
            }
        });
    }
}