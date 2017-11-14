import {Calendar} from "./types/Calendar";
import {DayPickerOptions} from "./types/DayPickerOptions";
import {HTMLDayPickerTargetElement} from "./types/HTMLDayPickerTargetElement";
import {HTMLDayPickerElement} from "./types/HTMLDayPickerElement";
import {ElementPosition} from "./types/ElementPosition";
import {DateParts} from "./types/DateParts";
import {createElement, addClass, removeClass, getAbsolutePosition, hasClass} from "./utils/domUtils";
import {GregorianCalendar} from "./calendars/GregorianCalendar";
import {isSameDate, changeYear, changeMonth, changeDate} from "./utils/dateUtils";
import {DayPickerValue} from "../../dist/dist/ts/types/HTMLDayPickerElement.d";

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

    public getValue() : number {
        return this.currentValue;
    }

    public setValue(value : number, isDisplayed? : boolean) : void {
        if (this.onValueChange) {
            this.onValueChange(value, this.currentValue);
        }

        if (isDisplayed) {
            this.displayedValue = value;
        }

        this.currentValue = value;
        // this.target.value = this.currentValue.toString();

        this.renderCalendar();
    }

    public setDisplayedValue(value : number) : void {
        this.displayedValue = value;

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
        this.target.addEventListener("keyup", this.onKeyup.bind(this));

        this.root.addEventListener("mousedown", this.onCalendarClick.bind(this));
        this.root.addEventListener("keyup", this.onKeyup.bind(this));

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

    private onCalendarClick(e : MouseEvent) : void {
        const target : HTMLDayPickerElement<HTMLElement> = e.target as HTMLDayPickerElement<HTMLElement>;

        if (e.which !== 1 || !(target instanceof HTMLElement) || !target.dayPickerValue) {
            return;
        }

        if (
            hasClass(target, "day-container") &&
            !hasClass(target, "day-container__disabled") &&
            !hasClass(target, "day-container__current")
        ) {
            this.setValue((target).dayPickerValue);
        } else if (
            hasClass(target, "previous-year") ||
            hasClass(target, "previous-month") ||
            hasClass(target, "next-year") ||
            hasClass(target, "next-month")
        ) {
            this.setDisplayedValue(target.dayPickerValue);
        }
    }

    // Key Code: 27 - ESC, 37 - Arrow Left, 38 - Up, 39 - Right, 40 - Down
    private onKeyup(e : KeyboardEvent) : void {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);

        if (e.keyCode === 27) {
            this.hideCalendar();
        } else if (e.keyCode === 37) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, -1)));
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, -1)));
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(displayedDateParts, -1, this.calendar)), true);
            }
        } else if (e.keyCode === 38) {
            this.setValue(this.calendar.toTimestamp(changeDate(displayedDateParts, -7, this.calendar)), true);
        } else if (e.keyCode === 39) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, 1)));
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, 1)));
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(displayedDateParts, 1, this.calendar)), true);
            }
        } else if (e.keyCode === 40) {
            this.setValue(this.calendar.toTimestamp(changeDate(displayedDateParts, 7, this.calendar)), true);
        }
    }

    private onBodyClick(e : MouseEvent) : void {
        const target : HTMLElement = e.target as HTMLElement;

        if (e.which !== 1 || this.target.contains(target) || this.root.contains(target)) {
            return;
        }

        this.hideCalendar();
    }

    private renderCalendar() : void {
        // Run after all event listeners
        setTimeout(() => {
            this.root.innerHTML = "";
            const df : DocumentFragment = window.document.createDocumentFragment();

            df.appendChild(this.renderHeader());
            df.appendChild(this.renderMonth());

            this.root.appendChild(df);
        }, 0);
    }

    private renderHeader() : HTMLDivElement {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const label : string = `${this.calendar.getMonthName(displayedDateParts.month)} ${displayedDateParts.year}`;
        const container : HTMLDivElement = createElement<HTMLDivElement>("div", "header-container");

        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>("div", "previous-year", {
            attributes: {
                title: "Previous Year",
                dayPickerValue: this.calendar.toTimestamp(changeYear(displayedDateParts, -1))
            }
        }));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>("div", "previous-month", {
            attributes: {
                title: "Previous Month",
                dayPickerValue: this.calendar.toTimestamp(changeMonth(displayedDateParts, -1))
            }
        }));
        container.appendChild(createElement<HTMLDivElement>("div", "selected-year-month", label));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>("div", "next-month", {
            attributes: {
                title: "Next Month",
                dayPickerValue: this.calendar.toTimestamp(changeMonth(displayedDateParts, 1))
            }
        }));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>("div", "next-year", {
            attributes: {
                title: "Next Year",
                dayPickerValue: this.calendar.toTimestamp(changeYear(displayedDateParts, 1))
            }
        }));

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
        if (typeof dayOfMonth === "undefined") {
            return createElement<HTMLDivElement>("div", ["day-container", "day-container__disabled"]);
        }

        // Days of month are 0 based, so we need to increase by 1
        dayOfMonth += 1;

        const todayDateParts : DateParts = this.calendar.toDateParts(Date.now());
        const currentDateParts : DateParts = this.calendar.toDateParts(this.currentValue);
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        displayedDateParts.date = dayOfMonth;

        const dayContainer : HTMLDayPickerElement<HTMLDivElement> = createElement<HTMLDayPickerElement<HTMLDivElement>>(
            "div",
            "day-container",
            dayOfMonth.toString()
        );

        dayContainer.dayPickerValue = this.calendar.toTimestamp(displayedDateParts);;

        if (!isSameDate(currentDateParts, displayedDateParts)) {
            addClass(dayContainer, "day-container__current");
        }

        if (!isSameDate(todayDateParts, displayedDateParts)) {
            addClass(dayContainer, "day-container__today");
        }

        return dayContainer;
    }
}
