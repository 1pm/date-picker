import {Calendar} from "../types/Calendar";
import {DateParts} from "../types/DateParts";
import {toJalaali, toGregorian, jalaaliMonthLength} from "../external/jalaali";

export const IranianCalendar : Calendar = {
    months: [
        "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
        "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
    ],
    weekdays: [
        "Yekshanbeh", "Doshanbeh", "Seshhanbeh", "Chaharshanbeh", "Panjshanbeh", "Jomeh", "Shanbeh"
    ],
    isRightToLeft: true,
    toDateParts(ts : number) : DateParts {
        const parts : any = toJalaali(new Date(ts));

        return {
            year: parts.jy,
            month: parts.jm,
            date: parts.jd,
        };
    },
    toTimestamp(dp : DateParts) : number {
        const parts : any = toGregorian(dp.year, dp.month, dp.date);

        return new Date(parts.gy, parts.gm - 1, parts.gd).getTime();
    },
    getMonthName(month : number) : string {
        return IranianCalendar.months[month - 1];
    },
    getWeekday(ts : number) : number {
        return new Date(ts).getDay();
    },
    getWeekdayName(weekday : number) : string {
        return IranianCalendar.weekdays[weekday];
    },
    daysCountInMonth(year : number, month : number) : number {
        return jalaaliMonthLength(year, month);
    },
    getWeekdaysInMonth(year : number, month : number) : Array<number> {
        const daysCount : number = IranianCalendar.daysCountInMonth(year, month);
        const weekdays : Array<number> = [];
        let weekday : number = IranianCalendar.getWeekday(IranianCalendar.toTimestamp({year, month, date: 1}));

        for (let i = 0; i < daysCount; i++) {
            weekdays.push(weekday);
            weekday = (weekday + 1) % 7;
        }

        return weekdays;
    },
    format(ts : number, format : string) : string {
        const dp : DateParts = IranianCalendar.toDateParts(ts);

        return `${dp.year}-${dp.month}-${dp.date}`;
    },
};
