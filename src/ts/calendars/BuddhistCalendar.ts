import {Calendar} from "../types/Calendar";
import {DateParts} from "../types/DateParts";
import {GregorianCalendar} from "./GregorianCalendar";

const YEAR_MODIFIER = 543;

export const BuddhistCalendar : Calendar = (Object as any).assign({}, GregorianCalendar, {
    toDateParts(ts : number) : DateParts {
        const date : Date = new Date(ts);
        return {
            year: date.getFullYear() + YEAR_MODIFIER,
            month: date.getMonth(),
            date: date.getDate(),
        };
    },
    toTimestamp(dp : DateParts) : number {
        return new Date(dp.year - YEAR_MODIFIER, dp.month, dp.date).getTime();
    },
    daysCountInMonth(year : number, month : number) : number {
        return new Date(year - YEAR_MODIFIER, month % 12, 0).getDate();
    },
    getWeekdaysInMonth(year : number, month : number) : Array<number> {
        const daysCount : number = BuddhistCalendar.daysCountInMonth(year, month);
        const weekdays : Array<number> = [];
        let weekday : number = BuddhistCalendar.getWeekday(BuddhistCalendar.toTimestamp({year, month, date: 1}));

        for (let i = 0; i < daysCount; i++) {
            weekdays.push(weekday);
            weekday = (weekday + 1) % 7;
        }

        return weekdays;
    },
    format(ts : number, format : string) : string {
        const dp : DateParts = BuddhistCalendar.toDateParts(ts);

        return `${dp.year}-${dp.month + 1}-${dp.date}`;
    },
});
