import {DayPickerOptions} from "./types/DayPickerOptions";
import {createElement} from "./utils/domUtils";

export class DayPicker {
    private target : HTMLInputElement;
    private root : HTMLDivElement;
    private currentValue : number;
    private format : string;
    // private calendar : Calendar;

    constructor(target : HTMLInputElement, options : DayPickerOptions = {}) {
        this.target = target;
        this.currentValue = options.value || Date.now();
        this.format = options.format || "YYYY-MM-DD";
        this.root = createElement<HTMLDivElement>("div", "day-picker");

        this.initCalendar();
    }

    private initCalendar() : void {
        window.document.body.appendChild(this.root);
        this.target.value = this.currentValue.toString();
        this.renderCalendar();
    }

    private renderCalendar() : void {
        this.root.innerHTML = "";
        const df : DocumentFragment = window.document.createDocumentFragment();

        const year : HTMLDivElement = this.renderYear();
        df.appendChild(year);

        const month : HTMLDivElement = this.renderMonth();
        df.appendChild(month);

        const days : HTMLDivElement = this.renderDays();
        df.appendChild(days);

        this.root.appendChild(df);
    }

    private renderYear() : HTMLDivElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "year-container");

        const previousButton : HTMLButtonElement = createElement<HTMLButtonElement>("button", "previous-year", "<<");
        container.appendChild(previousButton);

        const currentYear : HTMLDivElement = createElement<HTMLDivElement>("div", "current-year", "2017");
        container.appendChild(currentYear);

        const nextButton : HTMLButtonElement = createElement<HTMLButtonElement>("button", "next-year", ">>");
        container.appendChild(nextButton);

        return container;
    }

    private renderMonth() : HTMLDivElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "month-container");

        const previousButton : HTMLButtonElement = createElement<HTMLButtonElement>("button", "previous-month", "<");
        container.appendChild(previousButton);

        const currentYear : HTMLDivElement = createElement<HTMLDivElement>("div", "current-month", "November");
        container.appendChild(currentYear);

        const nextButton : HTMLButtonElement = createElement<HTMLButtonElement>("button", "next-month", ">");
        container.appendChild(nextButton);

        return container;
    }

    private renderDays() : HTMLDivElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "days-container", "HERE WILL BE DAYS");

        return container;
    }
}
