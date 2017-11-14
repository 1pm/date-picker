import {DateParts} from "./DateParts";

export interface Calendar {
    months : Array<string>;
    weekdays : Array<string>;
    toDateParts : (ts : number) => DateParts;
    toTimestamp : (year : number, month : number, date : number) => number;
    getYear : (ts : number) => number;
    getMonth : (ts : number) => number;
    getMonthName : (ts : number) => string;
    getDate : (ts : number) => number;
    getWeekday : (ts : number) => number;
    getWeekdayName : (weekday : number) => string;
    daysCountInMonth : (year : number, month : number) => number;
    getWeekdaysInMonth : (year : number, month : number) => Array<number>;
    rightToLeft? : boolean;
};
