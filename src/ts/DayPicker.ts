import {Calendar} from "./types/Calendar";
import {DayPickerOptions} from "./types/DayPickerOptions";
import {HTMLDayPickerTargetElement} from "./types/HTMLDayPickerTargetElement";
import {HTMLDayPickerElement} from "./types/HTMLDayPickerElement";
import {ElementPosition} from "./types/ElementPosition";
import {DateParts} from "./types/DateParts";
import {CLASS_NAMES, HTML_TAGS, EVENTS} from "./constants";
import {isUndefined, isFunction, isEmpty} from "./utils/codeUtils";
import {createElement, addClass, removeClass, getAbsolutePosition, hasClass} from "./utils/domUtils";
import {isSameDate, changeYear, changeMonth, changeDate, convertToWeeks} from "./utils/dateUtils";
import {GregorianCalendar} from "./calendars/GregorianCalendar";
import {BuddhistCalendar} from "./calendars/BuddhistCalendar";
import {IranianCalendar} from "./calendars/IranianCalendar";

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
        if (!(target instanceof HTMLInputElement) || ["text", "date"].indexOf(target.type) < 0) {
            throw new Error("Day picker can be initialized only on <input type=\"text\"> or <input type=\"date\">");
        }

        if (!isUndefined(target.dayPicker)) {
            throw new Error("DayPicker already initialized");
        }

        this.target = target;
        this.target.dayPicker = this;
        this.calendar = IranianCalendar;
        this.currentValue = options.value || Date.now();
        this.format = options.format || "YYYY-MM-DD";
        this.root = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.DAY_PICKER);
        this.isCalendarVisible = false;

        if (isFunction(options.onValueChange)) {
            this.onValueChange = options.onValueChange;
        }

        this.initRoot();
    }

    public showCalendar() : void {
        this.isCalendarVisible = true;
        addClass(this.root, CLASS_NAMES.DAY_PICKER_ACTIVE);
    }

    public hideCalendar() : void {
        this.isCalendarVisible = false;
        removeClass(this.root, CLASS_NAMES.DAY_PICKER_ACTIVE);
    }

    public getValue() : number {
        return this.currentValue;
    }

    public setValue(value : number) : void {
        if (isFunction(this.onValueChange)) {
            this.onValueChange(value, this.currentValue);
        }

        this.currentValue = value;
        this.target.value = this.calendar.format(this.currentValue, this.format);

        this.setDisplayedValue(value);
    }

    public setDisplayedValue(value : number, shouldDisplay? : boolean) : void {
        this.displayedValue = value;

        this.updateRoot(shouldDisplay);
    }

    private updateRoot(shouldDisplay : boolean) : void {
        // TODO: refactor
        const currentElement : HTMLElement = this.root.querySelector(`.${CLASS_NAMES.DAY_CONTAINER_CURRENT}`);

        if (!isEmpty(currentElement)) {
            removeClass(currentElement, CLASS_NAMES.DAY_CONTAINER_CURRENT);
        }

        const dateElements : NodeListOf<Element> = this.root.querySelectorAll(`.${CLASS_NAMES.DAY_CONTAINER}`);
        const selectedElement = Array.prototype.slice.call(dateElements).filter((element : HTMLDayPickerElement<HTMLElement>) => {
            return element.dayPickerValue === this.currentValue;
        });

        if (!isEmpty(selectedElement)) {
            addClass(selectedElement[0], CLASS_NAMES.DAY_CONTAINER_CURRENT);
        }

        if (isEmpty(selectedElement) || shouldDisplay === true) {
            this.renderRoot();
        }
    }

    private initRoot() : void {
        const targetPosition : ElementPosition = getAbsolutePosition(this.target);
        this.root.tabIndex = -1;
        this.root.style.top = targetPosition.top + targetPosition.height + 5 + "px";
        this.root.style.left = targetPosition.left + "px";
        this.target.value = this.calendar.format(this.currentValue, this.format);

        this.displayedValue = this.currentValue;

        this.target.addEventListener(EVENTS.MOUDOWN, this.onInputClick.bind(this));
        this.target.addEventListener(EVENTS.KEYDOWN, this.onKeyup.bind(this));

        this.root.addEventListener(EVENTS.MOUDOWN, this.onRootClick.bind(this));
        this.root.addEventListener(EVENTS.KEYDOWN, this.onKeyup.bind(this));

        window.document.body.addEventListener(EVENTS.MOUDOWN, this.onBodyClick.bind(this));
        window.document.body.appendChild(this.root);

        this.renderRoot();
    }

    private onInputClick(e : MouseEvent) : void {
        if (e.which !== 1) {
            return;
        }

        this.showCalendar();
    }

    private onRootClick(e : MouseEvent) : void {
        const target : HTMLDayPickerElement<HTMLElement> = e.target as HTMLDayPickerElement<HTMLElement>;

        if (e.which !== 1 || !(target instanceof HTMLElement) || isUndefined(target.dayPickerValue)) {
            return;
        }

        if (
            hasClass(target, CLASS_NAMES.DAY_CONTAINER) &&
            !hasClass(target, CLASS_NAMES.DAY_CONTAINER_DISABLED) &&
            !hasClass(target, CLASS_NAMES.DAY_CONTAINER_CURRENT)
        ) {
            this.setValue((target).dayPickerValue);
        } else if (
            hasClass(target, CLASS_NAMES.PREVIOUS_YEAR) ||
            hasClass(target, CLASS_NAMES.PREVIOUS_MONTH) ||
            hasClass(target, CLASS_NAMES.NEXT_YEAR) ||
            hasClass(target, CLASS_NAMES.NEXT_MONTH)
        ) {
            this.setDisplayedValue(target.dayPickerValue, true);
        }
    }

    // Key Code: 27 - ESC, 37 - Arrow Left, 38 - Up, 39 - Right, 40 - Down
    private onKeyup(e : KeyboardEvent) : void {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const currentDateParts : DateParts = this.calendar.toDateParts(this.currentValue);

        if ([27, 37, 38, 39, 40].indexOf(e.keyCode) > 0) {
            // Avoid page scrolling
            e.preventDefault();
            e.stopPropagation();
        }

        if (e.keyCode === 27) {
            this.hideCalendar();
        } else if (e.keyCode === 37) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, -1)), true);
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, -1)), true);
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, -1, this.calendar)));
            }
        } else if (e.keyCode === 38) {
            this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, -7, this.calendar)));
        } else if (e.keyCode === 39) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, 1)), true);
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, 1)), true);
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, 1, this.calendar)));
            }
        } else if (e.keyCode === 40) {
            this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, 7, this.calendar)));
        }
    }

    private onBodyClick(e : MouseEvent) : void {
        const target : HTMLElement = e.target as HTMLElement;

        if (e.which !== 1 || this.target.contains(target) || this.root.contains(target)) {
            return;
        }

        this.hideCalendar();
    }

    private renderRoot() : void {
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
        const container : HTMLDivElement = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.HEADER_CONTAINER);
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const label : string = `${this.calendar.getMonthName(displayedDateParts.month)} ${displayedDateParts.year}`;

        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>(HTML_TAGS.DIV, CLASS_NAMES.PREVIOUS_YEAR, {
            attributes: {
                title: "Previous Year",
                dayPickerValue: this.calendar.toTimestamp(changeYear(displayedDateParts, -1))
            }
        }));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>(HTML_TAGS.DIV, CLASS_NAMES.PREVIOUS_MONTH, {
            attributes: {
                title: "Previous Month",
                dayPickerValue: this.calendar.toTimestamp(changeMonth(displayedDateParts, -1))
            }
        }));
        container.appendChild(createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.CURRENT_YEAR_MONTH, label));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>(HTML_TAGS.DIV, CLASS_NAMES.NEXT_MONTH, {
            attributes: {
                title: "Next Month",
                dayPickerValue: this.calendar.toTimestamp(changeMonth(displayedDateParts, 1))
            }
        }));
        container.appendChild(createElement<HTMLDayPickerElement<HTMLDivElement>>(HTML_TAGS.DIV, CLASS_NAMES.NEXT_YEAR, {
            attributes: {
                title: "Next Year",
                dayPickerValue: this.calendar.toTimestamp(changeYear(displayedDateParts, 1))
            }
        }));

        return container;
    }

    private renderMonth() : HTMLDivElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.MONTH_CONTAINER);
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const weekdaysInMonth : Array<number> = this.calendar.getWeekdaysInMonth(
            displayedDateParts.year,
            displayedDateParts.month
        );
        const weeks : Array<Array<number>> = convertToWeeks(weekdaysInMonth);

        container.appendChild(this.renderWeekdays());

        for (let i = 0; i < weeks.length; i++) {
            container.appendChild(this.renderWeek(weeks[i]));
        }

        return container;
    }

    private renderWeekdays() : HTMLDivElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.WEEKDAYS_CONTAINER);
        const weekdays : Array<string> = this.calendar.isRightToLeft !== true ?
            this.calendar.weekdays : this.calendar.weekdays.slice(0).reverse();

        this.calendar.weekdays.forEach((weekday) => {
            container.appendChild(createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.WEEKDAY_CONTAINER, weekday.substring(0, 3)));
        });

        return container;
    }

    private renderWeek(week : Array<number>) : HTMLElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.WEEK_CONTAINER);
        const days : Array<number> = this.calendar.isRightToLeft !== true ? week : week.slice(0).reverse();

        for (let i = 0; i < days.length; i++) {
            container.appendChild(this.renderDay(days[i]));
        }

        return container;
    }

    private renderDay(dayOfMonth? : number) : HTMLDayPickerElement<HTMLDivElement> {
        if (isUndefined(dayOfMonth)) {
            return createElement<HTMLDivElement>(HTML_TAGS.DIV, [CLASS_NAMES.DAY_CONTAINER, CLASS_NAMES.DAY_CONTAINER_DISABLED]);
        }

        const todayDateParts : DateParts = this.calendar.toDateParts(Date.now());
        const currentDateParts : DateParts = this.calendar.toDateParts(this.currentValue);
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        displayedDateParts.date = dayOfMonth;

        const dayContainer : HTMLDayPickerElement<HTMLDivElement> = createElement<HTMLDayPickerElement<HTMLDivElement>>(
            HTML_TAGS.DIV,
            CLASS_NAMES.DAY_CONTAINER,
            dayOfMonth.toString()
        );

        dayContainer.dayPickerValue = this.calendar.toTimestamp(displayedDateParts);

        if (!isSameDate(currentDateParts, displayedDateParts)) {
            addClass(dayContainer, CLASS_NAMES.DAY_CONTAINER_CURRENT);
        }

        if (!isSameDate(todayDateParts, displayedDateParts)) {
            addClass(dayContainer, CLASS_NAMES.DAY_CONTAINER_TODAY);
        }

        return dayContainer;
    }
}
