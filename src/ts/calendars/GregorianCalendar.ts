import {Calendar} from "../types/Calendar";
import {DateParts} from "../types/DateParts";

export const GregorianCalendar : Calendar = {
    months: [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ],
    weekdays: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    rightToLeft: false,
    toDateParts(ts : number) : DateParts {
        return {
            year: GregorianCalendar.getYear(ts),
            month: GregorianCalendar.getMonth(ts),
            date: GregorianCalendar.getDate(ts),
        };
    },
    toTimestamp(dp : DateParts) : number {
        return new Date(dp.year, dp.month - 1, dp.date).getTime();
    },
    getYear(ts : number) : number {
        return new Date(ts).getFullYear();
    },
    getMonth(ts : number) : number {
        return new Date(ts).getMonth() + 1;
    },
    getMonthName(month : number) : string {
        return GregorianCalendar.months[month - 1];
    },
    getDate(ts : number) : number {
        return new Date(ts).getDate();
    },
    getWeekday(ts : number) : number {
        return new Date(ts).getDay();
    },
    getWeekdayName(weekday : number) : string {
        return GregorianCalendar.weekdays[weekday];
    },
    daysCountInMonth(year : number, month : number) : number {
        return new Date(year, month % 12, 0).getDate();
    },
    getWeekdaysInMonth(year : number, month : number) : Array<number> {
        const daysCount : number = GregorianCalendar.daysCountInMonth(year, month);
        const weekdays : Array<number> = [];
        let weekday : number = GregorianCalendar.getWeekday(GregorianCalendar.toTimestamp({year, month, date: 1}));

        for (let i = 0; i < daysCount; i++) {
            weekdays.push(weekday);
            weekday = (weekday + 1) % 7;
        }

        return weekdays;
    },
    format(value : number, format : string) : string {
        const dp : DateParts = GregorianCalendar.toDateParts(value as number);

        return `${dp.year}-${dp.month}-${dp.date}`;
    },
};
