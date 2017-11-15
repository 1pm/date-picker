import {DateParts} from "../types/DateParts";
import {Calendar} from "../types/Calendar";

function cloneDateParts(dp : DateParts) : DateParts {
    return (Object as any).assign({}, dp);
}

export function convertToWeeks(weekdaysInMonth : Array<number>) : Array<Array<number>> {
    const weeks : Array<Array<number>> = [];

    let last;
    const res = weekdaysInMonth.reduce((arr, v) => {
        // check the difference between last value and current
        // value is 1
        if (v - last == 1) {
          // if 1 then push the value into the last array element
          arr[arr.length - 1][v] = v;
        } else{
          // else push it as a new array element
          var tmp = new Array(7);
          tmp[v] = v;
          arr.push(tmp);
        // update the last element value
        }
        last = v;
        // return the array refernece
        return arr;
        // set initial value as empty array
      }, []);
      console.log(res);

    return weeks;
}

export function isSameDate(dp1 : DateParts, dp2 : DateParts) : boolean {
    return dp1.year !== dp2.year || dp1.month !== dp2.month || dp1.date !== dp2.date;
}

export function changeYear(dp : DateParts, modifier : number) : DateParts {
    const newDp : DateParts = cloneDateParts(dp);

    newDp.year += modifier;

    return newDp;
}

export function changeMonth(dp : DateParts, modifier : number) : DateParts {
    const newDp : DateParts = cloneDateParts(dp);

    newDp.month += modifier;
    const monthIndex : number = newDp.month - 1;

    if (monthIndex < 0 || monthIndex > 11) {
        newDp.year = changeYear(newDp, monthIndex > 11 ? 1 : -1).year;
        newDp.month = ((monthIndex + 12) % 12) + 1;
    }

    return newDp;
}

export function changeDate(dp : DateParts, modifier : number, calendar : Calendar) : DateParts {
    let ts : number = calendar.toTimestamp(dp);

    ts += modifier * (1000 * 60 * 60 * 24);

    return calendar.toDateParts(ts);
}
