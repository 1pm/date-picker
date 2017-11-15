import {Calendar} from "../types/Calendar";
import {DateParts} from "../types/DateParts";
import {CalendarAlgorithms} from "../external/CalendarAlgorithms";

export const IranianCalendar : Calendar = {
    months: [
        "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
        "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
    ],
    weekdays: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    isRightToLeft: true,
    toDateParts(ts : number) : DateParts {
        const parts : Array<number> = CalendarAlgorithms.gregorian_to_persiana(ts);

        return {
            year: parts[0],
            month: parts[1] + 1,
            date: parts[2] + 1,
        };
    },
    toTimestamp(dp : DateParts) : number {
        const parts : Array<number> = CalendarAlgorithms.persiana_to_gregorian(dp.year, dp.month, dp.date);

        return new Date(parts[0], parts[1], parts[2]).getTime();
    },
    getYear(ts : number) : number {
        return IranianCalendar.toDateParts(ts).year;
    },
    getMonth(ts : number) : number {
        return IranianCalendar.toDateParts(ts).month;
    },
    getMonthName(month : number) : string {
        return IranianCalendar.months[month - 1];
    },
    getDate(ts : number) : number {
        return IranianCalendar.toDateParts(ts).date;
    },
    getWeekday(ts : number) : number {
        return CalendarAlgorithms.gWeekDayToPersian(new Date(ts).getDay());
    },
    getWeekdayName(weekday : number) : string {
        return IranianCalendar.weekdays[weekday];
    },
    daysCountInMonth(year : number, month : number) : number {
        const monthIndex : number = month - 1;

        if (monthIndex < 6) {
            return 31;
        } else if (monthIndex < 12) {
            return 30;
        }

        return CalendarAlgorithms.leap_persiana(year) ? 30 : 29;
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
