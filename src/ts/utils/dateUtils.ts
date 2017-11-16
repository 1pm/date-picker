import {DateParts} from "../types/DateParts";
import {Calendar} from "../types/Calendar";
import {leftPad, isEmpty} from "./codeUtils";

function cloneDateParts(dp : DateParts) : DateParts {
    return (Object as any).assign({}, dp);
}

export function convertToWeeks(weekdaysInMonth : Array<number>) : Array<Array<number>> {
    let last;

    return weekdaysInMonth.reduce((array, value, i) => {

        if (value - last === 1) {
          array[array.length - 1][value] = i + 1;
        } else {
          const week = new Array(7);
          week[value] = i + 1;
          array.push(week);
        }
        last = value;

        return array;
      }, []);
}

export function isSameDate(dp1 : DateParts, dp2 : DateParts) : boolean {
    return dp1.year === dp2.year && dp1.month === dp2.month && dp1.date === dp2.date;
}

export function changeYear(dp : DateParts, modifier : number) : DateParts {
    const newDp : DateParts = cloneDateParts(dp);

    newDp.year += modifier;

    return newDp;
}

export function isBeforeDate(ts1 : number, ts2 : number) : boolean {
    return ts1 < ts2;
}

export function changeMonth(dp : DateParts, modifier : number) : DateParts {
    const newDp : DateParts = cloneDateParts(dp);

    newDp.month += modifier;
    const monthIndex : number = newDp.month;

    if (monthIndex < 0 || monthIndex > 11) {
        newDp.year = changeYear(newDp, monthIndex > 11 ? 1 : -1).year;
        newDp.month = ((monthIndex + 12) % 12);
    }

    return newDp;
}

export function changeDate(dp : DateParts, modifier : number, calendar : Calendar) : DateParts {
    let ts : number = calendar.toTimestamp(dp);

    ts += modifier * (1000 * 60 * 60 * 24);

    return calendar.toDateParts(ts);
}

export function parseDate(dateString : string, calendar : Calendar) : number {
    if (isEmpty(dateString)) {
        return;
    }

    const date : Date = new  Date(dateString);

    return calendar.toTimestamp({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
    });
}

export function formatDate(ts : number, targetType : string, calendar : Calendar, format : string) : string {
    const dp : DateParts = calendar.toDateParts(ts);
    const year : string = dp.year.toString();
    const month : string = dp.month.toString();
    const date : string = dp.date.toString();

    // Format `YYYY-MM-DD` is required for <input type="date">
    if (targetType === "date") {
        return `${dp.year}-${leftPad(dp.month, 2)}-${leftPad(dp.date, 2)}`;
    }

    return format
        .replace("YYYY", year)
        .replace("YY", year.slice(-2))
        .replace("Y", year.slice(-2))
        .replace("MMMM", calendar.getMonthName(dp.month))
        .replace("MMM", calendar.getMonthName(dp.month).substring(0, 3))
        .replace("MM", leftPad(dp.month, 2))
        .replace("MM", month)
        .replace("dddd", calendar.getWeekdayName(calendar.getWeekday(ts)))
        .replace("ddd", calendar.getWeekdayName(calendar.getWeekday(ts)).substring(0, 3))
        .replace("dd", calendar.getWeekdayName(calendar.getWeekday(ts)).substring(0, 2))
        .replace("DD", leftPad(dp.date, 2))
        .replace("D", date);
}
