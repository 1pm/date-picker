import {AstronomicalAlgorithms} from "./AstronomicalAlgorithms";

export const CalendarAlgorithms = {
    J0000: 1721424.5,
    J1970: 2440587.5,
    JMJD: 2400000.5,
    NormLeap: [false, true],
    GREGORIAN_EPOCH: 1721425.5,
    PERSIAN_EPOCH: 1948320.5,
    gregorian_to_persiana(ts) {
        return CalendarAlgorithms.jd_to_persian(
            CalendarAlgorithms.gregorian_to_jd(new Date(ts).getFullYear(), new Date(ts).getMonth(), new Date(ts).getDate())
        );
    },
    persiana_to_gregorian(year, month, day) {
        return CalendarAlgorithms.jd_to_gregorian(
            CalendarAlgorithms.persian_to_jd(year, month, day)
        );
    },
    leap_gregorian(year) {
        return ((year % 4) === 0) &&
          (!(((year % 100) === 0) && ((year % 400) !== 0)));
    },
    gregorian_to_jd(year, month, day) {
        return (CalendarAlgorithms.GREGORIAN_EPOCH - 1) +
          (365 * (year - 1)) +
          Math.floor((year - 1) / 4) +
          (-Math.floor((year - 1) / 100)) +
          Math.floor((year - 1) / 400) +
          Math.floor((((367 * month) - 362) / 12) +
            ((month <= 2) ? 0 :
                (CalendarAlgorithms.leap_gregorian(year) ? -1 : -2)
            ) +
            day);
    },
    jd_to_gregorian(jd) {
        let wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
          yindex, year, yearday, leapadj, month, day;

        wjd = Math.floor(jd - 0.5) + 0.5;
        depoch = wjd - CalendarAlgorithms.GREGORIAN_EPOCH;
        quadricent = Math.floor(depoch / 146097);
        dqc = AstronomicalAlgorithms.mod(depoch, 146097);
        cent = Math.floor(dqc / 36524);
        dcent = AstronomicalAlgorithms.mod(dqc, 36524);
        quad = Math.floor(dcent / 1461);
        dquad = AstronomicalAlgorithms.mod(dcent, 1461);
        yindex = Math.floor(dquad / 365);
        year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
        if (!((cent === 4) || (yindex === 4))) {
            year++;
        }
        yearday = wjd - CalendarAlgorithms.gregorian_to_jd(year, 1, 1);
        leapadj = ((wjd < CalendarAlgorithms.gregorian_to_jd(year, 3, 1)) ? 0
            :
            (CalendarAlgorithms.leap_gregorian(year) ? 1 : 2)
        );
        month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
        day = (wjd - CalendarAlgorithms.gregorian_to_jd(year, month, 1)) + 1;

        return [year, month, day];
    },
    tehran_equinox(year) {
        let equJED, equJD, equAPP, equTehran, dtTehran;

        //  March equinox in dynamical time
        equJED = AstronomicalAlgorithms.equinox(year, 0);

        //  Correct for delta T to obtain Universal time
        equJD = equJED - (AstronomicalAlgorithms.deltat(year) / (24 * 60 * 60));

        //  Apply the equation of time to yield the apparent time at Greenwich
        equAPP = equJD + AstronomicalAlgorithms.equationOfTime(equJED);

        /*  Finally, we must correct for the constant difference between
         the Greenwich meridian andthe time zone standard for
         Iran Standard time, 52°30' to the East.  */

        dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
        equTehran = equAPP + dtTehran;

        return equTehran;
    },
    tehran_equinox_jd(year) {
        let ep, epg;

        ep = CalendarAlgorithms.tehran_equinox(year);
        epg = Math.floor(ep);

        return epg;
    },
    persiana_year(jd) {
        let guess = CalendarAlgorithms.jd_to_gregorian(jd)[0] - 2,
          lasteq, nexteq, adr;

        lasteq = CalendarAlgorithms.tehran_equinox_jd(guess);
        let counter = 0;
        while (lasteq > jd && counter < 1000) {
            guess--;
            lasteq = CalendarAlgorithms.tehran_equinox_jd(guess);
            counter++;
        }
        nexteq = lasteq - 1;
        counter = 0;
        while (!((lasteq <= jd) && (jd < nexteq)) && counter < 1000) {
            lasteq = nexteq;
            guess++;
            nexteq = CalendarAlgorithms.tehran_equinox_jd(guess);
            counter++;
        }
        adr = Math.round((lasteq - CalendarAlgorithms.PERSIAN_EPOCH) / AstronomicalAlgorithms.TropicalYear) + 1;

        return [adr, lasteq];
    },
    jd_to_persiana(jd) {
        let year, month, day,
          adr, equinox, yday;

        jd = Math.floor(jd) + 0.5;
        adr = CalendarAlgorithms.persiana_year(jd);
        year = adr[0];
        equinox = adr[1];
        day = Math.floor((jd - equinox) / 30) + 1;

        yday = (Math.floor(jd) - CalendarAlgorithms.persiana_to_jd(year, 1, 1)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        day = (Math.floor(jd) - CalendarAlgorithms.persiana_to_jd(year, month, 1)) + 1;

        return [year, month, day];
    },
    persiana_to_jd(year, month, day) {
        let adr, equinox, guess, jd;

        guess = (CalendarAlgorithms.PERSIAN_EPOCH - 1) + (AstronomicalAlgorithms.TropicalYear * ((year - 1) - 1));
        adr = [year - 1, 0];

        let counter = 0;
        while (adr[0] < year && counter < 1000) {
            adr = CalendarAlgorithms.persiana_year(guess);
            guess = adr[1] + (AstronomicalAlgorithms.TropicalYear + 2);
            counter++;
        }
        equinox = adr[1];

        jd = equinox +
          ((month <= 7) ?
              ((month - 1) * 31) :
              (((month - 1) * 30) + 6)
          ) +
          (day - 1);
        return jd;
    },
    leap_persiana(year) {
        return (CalendarAlgorithms.persiana_to_jd(year + 1, 1, 1) -
          CalendarAlgorithms.persiana_to_jd(year, 1, 1)) > 365;
    },
    leap_persian(year) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    },
    persian_to_jd(year, month, day) {
        let epbase, epyear;

        epbase = year - ((year >= 0) ? 474 : 473);
        epyear = 474 + AstronomicalAlgorithms.mod(epbase, 2820);

        return day + ((month <= 7) ? ((month - 1) * 31) : (((month - 1) * 30) + 6)) +
          Math.floor(((epyear * 682) - 110) / 2816) +
          (epyear - 1) * 365 +
          Math.floor(epbase / 2820) * 1029983 +
          (CalendarAlgorithms.PERSIAN_EPOCH - 1);
    },
    jd_to_persian(jd) {
        let year, month, day, depoch, cycle, cyear, ycycle,
          aux1, aux2, yday;


        jd = Math.floor(jd) + 0.5;

        depoch = jd - CalendarAlgorithms.persian_to_jd(475, 1, 1);
        cycle = Math.floor(depoch / 1029983);
        cyear = AstronomicalAlgorithms.mod(depoch, 1029983);
        if (cyear === 1029982) {
            ycycle = 2820;
        } else {
            aux1 = Math.floor(cyear / 366);
            aux2 = AstronomicalAlgorithms.mod(cyear, 366);
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
              aux1 + 1;
        }
        year = ycycle + (2820 * cycle) + 474;
        if (year <= 0) {
            year--;
        }
        yday = (jd - CalendarAlgorithms.persian_to_jd(year, 1, 1)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        day = (jd - CalendarAlgorithms.persian_to_jd(year, month, 1)) + 1;
        return [year, month, day];
    },
    gWeekDayToPersian(weekday) {
        if (weekday + 2 === 8) {
            return 1;
        } else if (weekday + 2 === 7) {
            return 7;
        } else {
            return weekday + 2;
        }

    },
};
