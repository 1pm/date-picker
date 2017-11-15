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
    toDateParts(ts : number) : DateParts {
        const date : Date = new Date(ts);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        };
    },
    toTimestamp(dp : DateParts) : number {
        return new Date(dp.year, dp.month, dp.date).getTime();
    },
    getMonthName(month : number) : string {
        return GregorianCalendar.months[month];
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
    format(ts : number, format : string) : string {
        const dp : DateParts = GregorianCalendar.toDateParts(ts);

        return `${dp.year}-${dp.month + 1}-${dp.date}`;
    },
};
