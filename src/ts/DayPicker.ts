import {Calendar} from "./types/Calendar";
import {DayPickerOptions} from "./types/DayPickerOptions";
import {HTMLDayPickerTargetElement} from "./types/HTMLDayPickerTargetElement";
import {HTMLDayPickerElement} from "./types/HTMLDayPickerElement";
import {ElementPosition} from "./types/ElementPosition";
import {DateParts} from "./types/DateParts";
import {createElement, addClass, removeClass, getAbsolutePosition} from "./utils/domUtils";
import {GregorianCalendar} from "./calendars/GregorianCalendar";
import {Icons} from "./icons/Icons";
import {isFlatDiff} from "./utils/objectUtils";

export class DayPicker {
    private target : HTMLDayPickerTargetElement<HTMLInputElement>;
    private calendar : Calendar;
    private root : HTMLDivElement;
    private currentValue : number;
    private displayedValue : number;
    private format : string;
    private isCalendarVisible : boolean;
    private onValueChange : (value : number, oldValue? : number) => void;

    constructor(target : HTMLDayPickerTargetElement<HTMLInputElement>, options : DayPickerOptions = {}) {
        if (["text", "date"].indexOf(target.type) < 0 || !!target.dayPicker) {
            console.log("DayPicker already initialized");
            return;
        }

        this.target = target;
        this.target.dayPicker = this;
        this.calendar = GregorianCalendar;
        this.currentValue = options.value || Date.now();
        this.format = options.format || "YYYY-MM-DD";
        this.root = createElement<HTMLDivElement>("div", "day-picker");
        this.isCalendarVisible = false;

        if (typeof options.onValueChange === "function") {
            this.onValueChange = options.onValueChange;
        }

        this.initCalendar();
    }

    public showCalendar() : void {
        this.isCalendarVisible = true;
        addClass(this.root, "day-picker__active");
    }

    public hideCalendar() : void {
        this.isCalendarVisible = false;
        removeClass(this.root, "day-picker__active");
    }

    public setValue(value : number) : void {
        if (this.onValueChange) {
            this.onValueChange(value, this.currentValue);
        }

        this.currentValue = value;

        this.renderCalendar();
    }

    private initCalendar() : void {
        const targetPosition : ElementPosition = getAbsolutePosition(this.target);
        this.root.tabIndex = -1;
        this.root.style.top = targetPosition.top + targetPosition.height + 5 + "px";
        this.root.style.left = targetPosition.left + "px";
        // this.target.value = this.currentValue.toString();

        this.displayedValue = this.currentValue;

        this.target.addEventListener("mousedown", this.onInputClick.bind(this));
        this.target.addEventListener("keyup", this.onInputKeyup.bind(this));

        this.root.addEventListener("mousedown", this.onCalendarClick.bind(this));
        this.root.addEventListener("keyup", this.onCalendarKeyup.bind(this));

        window.document.body.addEventListener("mousedown", this.onBodyClick.bind(this));
        window.document.body.appendChild(this.root);

        this.renderCalendar();
    }

    private onInputClick(e : MouseEvent) : void {
        if (e.which !== 1) {
            return;
        }

        this.showCalendar();
    }

    private onInputKeyup(e : KeyboardEvent) : void {
        if (e.keyCode === 27) {
            this.hideCalendar();
        }
    }

    private onCalendarClick(e : MouseEvent) : void {
        if (e.which !== 1) {
            return;
        }

        console.log("on Cal Click", e);
    }

    private onCalendarKeyup(e : KeyboardEvent) : void {
        console.log("on Cal Keyup", e);

        if (e.keyCode === 27) {
            this.hideCalendar();
        }
    }

    private onBodyClick(e : MouseEvent) : void {
        if (e.which !== 1 || this.target.contains(e.target as Node) || this.root.contains(e.target as Node)) {
            return;
        }

        this.hideCalendar();
    }

    private renderCalendar() : void {
        this.root.innerHTML = "";
        const df : DocumentFragment = window.document.createDocumentFragment();

        df.appendChild(this.renderHeader());
        df.appendChild(this.renderMonth());

        this.root.appendChild(df);
    }

    private renderHeader() : HTMLDivElement {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const label : string = `${this.calendar.getMonthName(displayedDateParts.month)} ${displayedDateParts.year}`;
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "header-container");

        container.appendChild(createElement<HTMLDivElement>("div", "previous-year", Icons.previousYear));
        container.appendChild(createElement<HTMLDivElement>("div", "previous-month", Icons.previousMonth));
        container.appendChild(createElement<HTMLDivElement>("div", "selected-year-month", label));
        container.appendChild(createElement<HTMLDivElement>("div", "next-month", Icons.nextMonth));
        container.appendChild(createElement<HTMLDivElement>("div", "next-year", Icons.nextYear));

        return container;
    }

    private renderMonth() : HTMLDivElement {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const weekdaysInMonth : Array<number> = this.calendar.getWeekdaysInMonth(
            displayedDateParts.year,
            displayedDateParts.month
        );
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "month-container");
        const weekdaysContainer : HTMLDivElement = createElement<HTMLDivElement>("div", "weekdays-container");

        this.calendar.weekdays.forEach((weekday) => {
            weekdaysContainer.appendChild(createElement<HTMLDivElement>("div", "weekday-container", weekday));
        });
        container.appendChild(weekdaysContainer);

        let weekContainer : HTMLDivElement = createElement<HTMLDivElement>("div", "week-container");

        // TODO: refactor
        weekdaysInMonth.forEach((weekday : number, dayOfMonth : number) => {
            weekContainer.appendChild(this.renderDay(dayOfMonth));

            if (weekday === 6) {
                while (weekContainer.children.length < 7) {
                    weekContainer.insertBefore(this.renderDay(), weekContainer.children[0]);
                }
                container.appendChild(weekContainer);
                weekContainer = createElement<HTMLDivElement>("div", "week-container");
            }
        });

        while (weekContainer.children.length < 7) {
            weekContainer.appendChild(this.renderDay());
        }

        container.appendChild(weekContainer);

        return container;
    }

    private renderDay(dayOfMonth? : number) : HTMLDayPickerElement<HTMLDivElement> {
        // Days of month are 0 based, so we need to increase by 1
        dayOfMonth += 1;

        const todayDateParts : DateParts = this.calendar.toDateParts(Date.now());
        const currentDateParts : DateParts = this.calendar.toDateParts(this.currentValue);
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        displayedDateParts.date = dayOfMonth;

        const dayContainer : HTMLDayPickerElement<HTMLDivElement> = createElement<HTMLDayPickerElement<HTMLDivElement>>(
            "div",
            "day-container",
            dayOfMonth ? dayOfMonth.toString() : ""
        );

        dayContainer.dayPickerValue = dayOfMonth;

        if (!isFlatDiff(currentDateParts, displayedDateParts)) {
            addClass(dayContainer, "day-container__current");
        }

        if (!isFlatDiff(todayDateParts, displayedDateParts)) {
            addClass(dayContainer, "day-container__today");
        }

        return dayContainer;
    }
}
