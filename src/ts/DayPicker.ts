import {Calendar} from "./types/Calendar";
import {DayPickerOptions} from "./types/DayPickerOptions";
import {HTMLDayPickerTargetElement} from "./types/HTMLDayPickerTargetElement";
import {HTMLDayPickerElement} from "./types/HTMLDayPickerElement";
import {ElementPosition} from "./types/ElementPosition";
import {DateParts} from "./types/DateParts";
import {CLASS_NAMES, HTML_TAGS, EVENTS, SUPPORTED_LOCALES, SUPPORTED_CALENDARS, CALENDARS, LOCALES} from "./constants";
import {isUndefined, isFunction, isEmpty, contains} from "./utils/codeUtils";
import {createElement, addClass, removeClass, getAbsolutePosition, hasClass} from "./utils/domUtils";
import {isSameDate, changeYear, changeMonth, changeDate, convertToWeeks, isBeforeDate, formatDate} from "./utils/dateUtils";
import {GregorianCalendar} from "./calendars/GregorianCalendar";
import {BuddhistCalendar} from "./calendars/BuddhistCalendar";
import {IranianCalendar} from "./calendars/IranianCalendar";

export class DayPicker {
    private isRootVisible : boolean;
    private target : HTMLDayPickerTargetElement<HTMLInputElement>;
    private root : HTMLDivElement;
    private locale : string;
    private calendar : Calendar;
    private currentValue : number;
    private displayedValue : number;
    private format : string;
    private min : number;
    private max : number;
    private ishideOnSelect : boolean;
    private onValueChange : (value : number, oldValue? : number) => void;

    constructor(target : HTMLDayPickerTargetElement<HTMLInputElement>, options : DayPickerOptions = {}) {
        if (!(target instanceof HTMLInputElement) || !contains(["text", "date"], target.type)) {
            throw new Error("Day picker can be initialized only on <input type=\"text\"> or <input type=\"date\">");
        }

        if (!isUndefined(target.dayPicker)) {
            throw new Error("DayPicker already initialized");
        }

        this.isRootVisible = false;
        this.target = target;
        this.target.dayPicker = this;
        this.root = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.DAY_PICKER);
        this.currentValue = options.value || Date.now();
        this.locale = this.getPreferedLocale(options.locale);
        this.format = options.format || "YYYY-MM-DD";
        this.calendar = this.getPreferedCalendar(options.calendar);
        this.min = (this.root as any).min || options.min;
        this.max = (this.root as any).max || options.max;
        this.ishideOnSelect = options.hideOnSelect || true;

        if (isFunction(options.onValueChange)) {
            this.onValueChange = options.onValueChange;
        }

        this.initRoot();
    }

    public showRoot() : void {
        this.isRootVisible = true;
        addClass(this.root, CLASS_NAMES.DAY_PICKER_ACTIVE);
    }

    public hideRoot() : void {
        this.isRootVisible = false;
        removeClass(this.root, CLASS_NAMES.DAY_PICKER_ACTIVE);
    }

    public getValue() : number {
        return this.currentValue;
    }

    public setValue(value : number) : void {
        if (isBeforeDate(value, this.min) || isBeforeDate(this.max, value)) {
            return;
        }

        if (isFunction(this.onValueChange)) {
            this.onValueChange(value, this.currentValue);
        }

        this.currentValue = value;
        this.target.value = formatDate(this.currentValue, this.target.type, this.calendar, this.locale);

        this.setDisplayedValue(value);
    }

    public setDisplayedValue(value : number, shouldDisplay? : boolean) : void {
        this.displayedValue = value;

        this.updateRoot(shouldDisplay);
    }

    private getPreferedLocale(locale : string) : string {
        if (!isUndefined(locale) && contains(SUPPORTED_LOCALES, locale)) {
            return locale;
        } else if (!isUndefined(window.navigator.languages)) {
            const languages = window.navigator.languages;

            for (let i = 0; i < languages.length; i++) {
                if (contains(SUPPORTED_LOCALES, languages[i])) {
                    return languages[i];
                }
            }
        } else if (
            !isUndefined(window.navigator.language) &&
            contains(SUPPORTED_LOCALES, window.navigator.language)
        ) {
            return window.navigator.language;
        }
    }

    private getPreferedCalendar(calendarName : string) : Calendar {
        if (contains(SUPPORTED_CALENDARS, calendarName)) {
            return this.getCalendar(calendarName);
        }

        calendarName = CALENDARS.GREGORIAN;

        if (!isUndefined(this.locale)) {
            switch (this.locale) {
                case LOCALES.THAI:
                    calendarName = CALENDARS.BUDDHIST;
                    break;
                case LOCALES.PERSIAN:
                    calendarName = CALENDARS.IRANIAN;
                    break;
                case LOCALES.ENGLISH:
                default:
                    calendarName = CALENDARS.GREGORIAN;
                    break;
            }
        }

        return this.getCalendar(calendarName);
    }

    private getCalendar(calendarName : string) : Calendar {
        switch (calendarName) {
            case CALENDARS.BUDDHIST:
                return BuddhistCalendar;
            case CALENDARS.IRANIAN:
                return IranianCalendar;
            case CALENDARS.GREGORIAN:
            default:
                return GregorianCalendar;
        }
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

        if (isEmpty(selectedElement) || shouldDisplay === true) {
            this.renderRoot();
        } else if (!isEmpty(selectedElement)) {
            addClass(selectedElement[0], CLASS_NAMES.DAY_CONTAINER_CURRENT);
        }
    }

    private initRoot() : void {
        const targetPosition : ElementPosition = getAbsolutePosition(this.target);
        this.root.tabIndex = -1;
        this.root.style.top = targetPosition.top + targetPosition.height + 5 + "px";
        this.root.style.left = targetPosition.left + "px";
        this.target.value = formatDate(this.currentValue, this.target.type, this.calendar, this.locale);

        this.displayedValue = this.currentValue;

        this.target.addEventListener(EVENTS.MOUDOWN, this.onInputClick.bind(this));
        this.target.addEventListener(EVENTS.KEYDOWN, this.onKeydown.bind(this));

        this.root.addEventListener(EVENTS.MOUDOWN, this.onRootClick.bind(this));
        this.root.addEventListener(EVENTS.KEYDOWN, this.onKeydown.bind(this));

        window.document.body.addEventListener(EVENTS.MOUDOWN, this.onBodyClick.bind(this));
        window.document.body.appendChild(this.root);

        this.renderRoot();
    }

    private onInputClick(e : MouseEvent) : void {
        if (e.which !== 1 || this.target.readOnly || this.target.disabled) {
            return;
        }

        this.showRoot();
    }

    private onRootClick(e : MouseEvent) : void {
        const target : HTMLDayPickerElement<HTMLElement> = e.target as HTMLDayPickerElement<HTMLElement>;

        if (
            e.which !== 1 ||
            this.target.readOnly ||
            this.target.disabled ||
            !(target instanceof HTMLElement) ||
            isUndefined(target.dayPickerValue)
        ) {
            return;
        }

        if (
            hasClass(target, CLASS_NAMES.DAY_CONTAINER) &&
            !hasClass(target, CLASS_NAMES.DAY_CONTAINER_DISABLED) &&
            !hasClass(target, CLASS_NAMES.DAY_CONTAINER_CURRENT)
        ) {
            this.setValue((target).dayPickerValue);

            if (this.ishideOnSelect) {
                this.hideRoot();
            }
        } else if (
            hasClass(target, CLASS_NAMES.PREVIOUS_YEAR) ||
            hasClass(target, CLASS_NAMES.PREVIOUS_MONTH) ||
            hasClass(target, CLASS_NAMES.NEXT_YEAR) ||
            hasClass(target, CLASS_NAMES.NEXT_MONTH)
        ) {
            this.setDisplayedValue(target.dayPickerValue, true);
        }
    }

    // Key Code: 27 - ESC, 37 - Left, 38 - Up, 39 - Right, 40 - Down
    private onKeydown(e : KeyboardEvent) : void {
        const displayedDateParts : DateParts = this.calendar.toDateParts(this.displayedValue);
        const currentDateParts : DateParts = this.calendar.toDateParts(this.currentValue);
        const directionModifier : number = this.calendar.isRightToLeft !== true ? 1 : -1;

        if (contains([27, 37, 38, 39, 40], e.keyCode) {
            // Avoid page scrolling
            e.preventDefault();
            e.stopPropagation();
        }

        if (e.keyCode === 27) {
            this.hideRoot();
        } else if (e.keyCode === 37) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, -1)), true);
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, -1)), true);
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, -1 * directionModifier, this.calendar)));
            }
        } else if (e.keyCode === 38) {
            this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, -7, this.calendar)));
        } else if (e.keyCode === 39) {
            if (e.ctrlKey && e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeYear(displayedDateParts, 1)), true);
            } else if (e.shiftKey) {
                this.setDisplayedValue(this.calendar.toTimestamp(changeMonth(displayedDateParts, 1)), true);
            } else {
                this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, 1 * directionModifier, this.calendar)));
            }
        } else if (e.keyCode === 40) {
            this.setValue(this.calendar.toTimestamp(changeDate(currentDateParts, 7, this.calendar)));
        // // TODO: Implement
        // } else if (e.target === this.target) {
        //     debounce(() => {
        //         console.log(new Date(e.target.value), Date.parse(e.target.value));
        //     }, 1000)();
        }
    }

    private onBodyClick(e : MouseEvent) : void {
        const target : HTMLElement = e.target as HTMLElement;

        if (e.which !== 1 || this.target.contains(target) || this.root.contains(target)) {
            return;
        }

        this.hideRoot();
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
        const weekdays : Array<string> = this.prepareWeekdays();

        for (let i = 0; i < weekdays.length; i++) {
            container.appendChild(createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.WEEKDAY_CONTAINER, weekdays[i]));
        }

        return container;
    }

    private renderWeek(week : Array<number>) : HTMLElement {
        const container : HTMLDivElement = createElement<HTMLDivElement>(HTML_TAGS.DIV, CLASS_NAMES.WEEK_CONTAINER);
        const days : Array<number> = this.prepareWeek(week);

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
        const displayedTimestamp = this.calendar.toTimestamp(displayedDateParts);

        const dayContainer : HTMLDayPickerElement<HTMLDivElement> = createElement<HTMLDayPickerElement<HTMLDivElement>>(
            HTML_TAGS.DIV,
            CLASS_NAMES.DAY_CONTAINER,
            dayOfMonth.toString()
        );

        dayContainer.dayPickerValue = displayedTimestamp;

        if (isBeforeDate(displayedTimestamp, this.min) || isBeforeDate(this.max, displayedTimestamp)) {
            addClass(dayContainer, CLASS_NAMES.DAY_CONTAINER_DISABLED);
        }

        if (!isSameDate(currentDateParts, displayedDateParts)) {
            addClass(dayContainer, CLASS_NAMES.DAY_CONTAINER_CURRENT);
        }

        if (!isSameDate(todayDateParts, displayedDateParts)) {
            addClass(dayContainer, CLASS_NAMES.DAY_CONTAINER_TODAY);
        }

        return dayContainer;
    }

    private prepareWeekdays() : Array<string> {
        const weekdays : Array<string> = this.calendar.isRightToLeft !== true ?
        this.calendar.weekdays : this.calendar.weekdays.slice(0).reverse();

        return weekdays.map((weekday) => {
            return weekday.substring(0, 3);
        });
    }

    private prepareWeek(week : Array<number>) : Array<number> {
        return this.calendar.isRightToLeft !== true ? week : week.slice(0).reverse();
    }
}
