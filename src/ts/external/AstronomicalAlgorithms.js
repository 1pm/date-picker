/*
 JavaScript functions for positional astronomy
 by John Walker  --  September, MIM
 http://www.fourmilab.ch/
 This program is in the public domain.
 */

export const AstronomicalAlgorithms = {
    J2000: 2451545.0,
    JulianCentury: 36525.0,
    JulianMillennium: 365250,
    TropicalYear: 365.24219878,
    oterms: [
        -4680.93,
        -1.55,
        1999.25,
        -51.38,
        -249.67,
        -39.05,
        7.12,
        27.87,
        5.79,
        2.45
    ],
    nutArgMult: [
        0, 0, 0, 0, 1,
        -2, 0, 0, 2, 2,
        0, 0, 0, 2, 2,
        0, 0, 0, 0, 2,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        -2, 1, 0, 2, 2,
        0, 0, 0, 2, 1,
        0, 0, 1, 2, 2,
        -2, -1, 0, 2, 2,
        -2, 0, 1, 0, 0,
        -2, 0, 0, 2, 1,
        0, 0, -1, 2, 2,
        2, 0, 0, 0, 0,
        0, 0, 1, 0, 1,
        2, 0, -1, 2, 2,
        0, 0, -1, 0, 1,
        0, 0, 1, 2, 1,
        -2, 0, 2, 0, 0,
        0, 0, -2, 2, 1,
        2, 0, 0, 2, 2,
        0, 0, 2, 2, 2,
        0, 0, 2, 0, 0,
        -2, 0, 1, 2, 2,
        0, 0, 0, 2, 0,
        -2, 0, 0, 2, 0,
        0, 0, -1, 2, 1,
        0, 2, 0, 0, 0,
        2, 0, -1, 0, 1,
        -2, 2, 0, 2, 2,
        0, 1, 0, 0, 1,
        -2, 0, 1, 0, 1,
        0, -1, 0, 0, 1,
        0, 0, 2, -2, 0,
        2, 0, -1, 2, 1,
        2, 0, 1, 2, 2,
        0, 1, 0, 2, 2,
        -2, 1, 1, 0, 0,
        0, -1, 0, 2, 2,
        2, 0, 0, 2, 1,
        2, 0, 1, 0, 0,
        -2, 0, 2, 2, 2,
        -2, 0, 1, 2, 1,
        2, 0, -2, 0, 1,
        2, 0, 0, 0, 1,
        0, -1, 1, 0, 0,
        -2, -1, 0, 2, 1,
        -2, 0, 0, 0, 1,
        0, 0, 2, 2, 1,
        -2, 0, 2, 0, 1,
        -2, 1, 0, 2, 1,
        0, 0, 1, -2, 0,
        -1, 0, 1, 0, 0,
        -2, 1, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 1, 2, 0,
        -1, -1, 1, 0, 0,
        0, 1, 1, 0, 0,
        0, -1, 1, 2, 2,
        2, -1, -1, 2, 2,
        0, 0, -2, 2, 2,
        0, 0, 3, 2, 2,
        2, -1, 0, 2, 2
    ],
    nutArgCoeff: [
        -171996, -1742, 92095, 89, /*  0,  0,  0,  0,  1 */
        -13187, -16, 5736, -31, /* -2,  0,  0,  2,  2 */
        -2274, -2, 977, -5, /*  0,  0,  0,  2,  2 */
        2062, 2, -895, 5, /*  0,  0,  0,  0,  2 */
        1426, -34, 54, -1, /*  0,  1,  0,  0,  0 */
        712, 1, -7, 0, /*  0,  0,  1,  0,  0 */
        -517, 12, 224, -6, /* -2,  1,  0,  2,  2 */
        -386, -4, 200, 0, /*  0,  0,  0,  2,  1 */
        -301, 0, 129, -1, /*  0,  0,  1,  2,  2 */
        217, -5, -95, 3, /* -2, -1,  0,  2,  2 */
        -158, 0, 0, 0, /* -2,  0,  1,  0,  0 */
        129, 1, -70, 0, /* -2,  0,  0,  2,  1 */
        123, 0, -53, 0, /*  0,  0, -1,  2,  2 */
        63, 0, 0, 0, /*  2,  0,  0,  0,  0 */
        63, 1, -33, 0, /*  0,  0,  1,  0,  1 */
        -59, 0, 26, 0, /*  2,  0, -1,  2,  2 */
        -58, -1, 32, 0, /*  0,  0, -1,  0,  1 */
        -51, 0, 27, 0, /*  0,  0,  1,  2,  1 */
        48, 0, 0, 0, /* -2,  0,  2,  0,  0 */
        46, 0, -24, 0, /*  0,  0, -2,  2,  1 */
        -38, 0, 16, 0, /*  2,  0,  0,  2,  2 */
        -31, 0, 13, 0, /*  0,  0,  2,  2,  2 */
        29, 0, 0, 0, /*  0,  0,  2,  0,  0 */
        29, 0, -12, 0, /* -2,  0,  1,  2,  2 */
        26, 0, 0, 0, /*  0,  0,  0,  2,  0 */
        -22, 0, 0, 0, /* -2,  0,  0,  2,  0 */
        21, 0, -10, 0, /*  0,  0, -1,  2,  1 */
        17, -1, 0, 0, /*  0,  2,  0,  0,  0 */
        16, 0, -8, 0, /*  2,  0, -1,  0,  1 */
        -16, 1, 7, 0, /* -2,  2,  0,  2,  2 */
        -15, 0, 9, 0, /*  0,  1,  0,  0,  1 */
        -13, 0, 7, 0, /* -2,  0,  1,  0,  1 */
        -12, 0, 6, 0, /*  0, -1,  0,  0,  1 */
        11, 0, 0, 0, /*  0,  0,  2, -2,  0 */
        -10, 0, 5, 0, /*  2,  0, -1,  2,  1 */
        -8, 0, 3, 0, /*  2,  0,  1,  2,  2 */
        7, 0, -3, 0, /*  0,  1,  0,  2,  2 */
        -7, 0, 0, 0, /* -2,  1,  1,  0,  0 */
        -7, 0, 3, 0, /*  0, -1,  0,  2,  2 */
        -7, 0, 3, 0, /*  2,  0,  0,  2,  1 */
        6, 0, 0, 0, /*  2,  0,  1,  0,  0 */
        6, 0, -3, 0, /* -2,  0,  2,  2,  2 */
        6, 0, -3, 0, /* -2,  0,  1,  2,  1 */
        -6, 0, 3, 0, /*  2,  0, -2,  0,  1 */
        -6, 0, 3, 0, /*  2,  0,  0,  0,  1 */
        5, 0, 0, 0, /*  0, -1,  1,  0,  0 */
        -5, 0, 3, 0, /* -2, -1,  0,  2,  1 */
        -5, 0, 3, 0, /* -2,  0,  0,  0,  1 */
        -5, 0, 3, 0, /*  0,  0,  2,  2,  1 */
        4, 0, 0, 0, /* -2,  0,  2,  0,  1 */
        4, 0, 0, 0, /* -2,  1,  0,  2,  1 */
        4, 0, 0, 0, /*  0,  0,  1, -2,  0 */
        -4, 0, 0, 0, /* -1,  0,  1,  0,  0 */
        -4, 0, 0, 0, /* -2,  1,  0,  0,  0 */
        -4, 0, 0, 0, /*  1,  0,  0,  0,  0 */
        3, 0, 0, 0, /*  0,  0,  1,  2,  0 */
        -3, 0, 0, 0, /* -1, -1,  1,  0,  0 */
        -3, 0, 0, 0, /*  0,  1,  1,  0,  0 */
        -3, 0, 0, 0, /*  0, -1,  1,  2,  2 */
        -3, 0, 0, 0, /*  2, -1, -1,  2,  2 */
        -3, 0, 0, 0, /*  0,  0, -2,  2,  2 */
        -3, 0, 0, 0, /*  0,  0,  3,  2,  2 */
        -3, 0, 0, 0           /*  2, -1,  0,  2,  2 */
    ],
    deltaTtab: [
        121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
        44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
        11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
        10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
        13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
        16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
        11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
        5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
        1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6,
        -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
        18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
        24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
        33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
        52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6
    ],
    EquinoxpTerms: [
        485, 324.96, 1934.136,
        203, 337.23, 32964.467,
        199, 342.08, 20.186,
        182, 27.85, 445267.112,
        156, 73.14, 45036.886,
        136, 171.52, 22518.443,
        77, 222.54, 65928.934,
        74, 296.72, 3034.906,
        70, 243.58, 9037.513,
        58, 119.81, 33718.147,
        52, 297.17, 150.678,
        50, 21.02, 2281.226,
        45, 247.54, 29929.562,
        44, 325.15, 31555.956,
        29, 60.93, 4443.417,
        18, 155.12, 67555.328,
        17, 288.79, 4562.452,
        16, 198.04, 62894.029,
        14, 199.76, 31436.921,
        12, 95.39, 14577.848,
        12, 287.11, 31931.756,
        12, 320.81, 34777.259,
        9, 227.73, 1222.114,
        8, 15.45, 16859.074
    ],
    JDE0tab1000: [
        new Array(1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071),
        new Array(1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025),
        new Array(1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074),
        new Array(1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006)
    ],
    JDE0tab2000: [
        new Array(2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057),
        new Array(2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030),
        new Array(2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078),
        new Array(2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032)
    ],
    dtr(d) {
        return (d * Math.PI) / 180.0;
    },
    rtd(r) {
        return (r * 180.0) / Math.PI;
    },
    fixangle(a) {
        return a - 360.0 * (Math.floor(a / 360.0));
    },
    fixangr(a) {
        return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
    },
    dsin(d) {
        return Math.sin(AstronomicalAlgorithms.dtr(d));
    },
    dcos(d) {
        return Math.cos(AstronomicalAlgorithms.dtr(d));
    },
    mod(a, b) {
        return a - (b * Math.floor(a / b));
    },
    jwday(j) {
        return AstronomicalAlgorithms.mod(Math.floor((j + 1.5)), 7);
    },
    obliqeq(jd) {
        var eps, u, v, i;
        v = u = (jd - AstronomicalAlgorithms.J2000) / (AstronomicalAlgorithms.JulianCentury * 100);
        eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

        if (Math.abs(u) < 1.0) {
            for (i = 0; i < 10; i++) {
                eps += (AstronomicalAlgorithms.oterms[i] / 3600.0) * v;
                v *= u;
            }
        }
        return eps;
    },
    nutation(jd) {
        var deltaPsi, deltaEpsilon,
            i, j,
            t = (jd - 2451545.0) / 36525.0, t2, t3, to10,
            ta = [],
            dp = 0, de = 0, ang;

        t3 = t * (t2 = t * t);

        ta[0] = AstronomicalAlgorithms.dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 +
            t3 / 189474.0);
        ta[1] = AstronomicalAlgorithms.dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 -
            t3 / 300000.0);
        ta[2] = AstronomicalAlgorithms.dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 +
            t3 / 56250.0);
        ta[3] = AstronomicalAlgorithms.dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 +
            t3 / 327270);
        ta[4] = AstronomicalAlgorithms.dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 +
            t3 / 450000.0);

        for (i = 0; i < 5; i++) {
            ta[i] = AstronomicalAlgorithms.fixangr(ta[i]);
        }

        to10 = t / 10.0;
        for (i = 0; i < 63; i++) {
            ang = 0;
            for (j = 0; j < 5; j++) {
                if (AstronomicalAlgorithms.nutArgMult[(i * 5) + j] !== 0) {
                    ang += AstronomicalAlgorithms.nutArgMult[(i * 5) + j] * ta[j];
                }
            }
            dp += (AstronomicalAlgorithms.nutArgCoeff[(i * 4) + 0] + AstronomicalAlgorithms.nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
            de += (AstronomicalAlgorithms.nutArgCoeff[(i * 4) + 2] + AstronomicalAlgorithms.nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
        }

        deltaPsi = dp / (3600.0 * 10000.0);
        deltaEpsilon = de / (3600.0 * 10000.0);

        return [deltaPsi, deltaEpsilon];
    },
    deltat(year) {
        var dt, f, i, t;

        if ((year >= 1620) && (year <= 2000)) {
            i = Math.floor((year - 1620) / 2);
            f = ((year - 1620) / 2) - i;
            /* Fractional part of year */
            dt = AstronomicalAlgorithms.deltaTtab[i] + ((AstronomicalAlgorithms.deltaTtab[i + 1] - AstronomicalAlgorithms.deltaTtab[i]) * f);
        } else {
            t = (year - 2000) / 100;
            if (year < 948) {
                dt = 2177 + (497 * t) + (44.1 * t * t);
            } else {
                dt = 102 + (102 * t) + (25.3 * t * t);
                if ((year > 2000) && (year < 2100)) {
                    dt += 0.37 * (year - 2100);
                }
            }
        }
        return dt;
    },
    equinox(year, which) {
        let deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

        if (year < 1000) {
            JDE0tab = AstronomicalAlgorithms.JDE0tab1000;
            Y = year / 1000;
        } else {
            JDE0tab = AstronomicalAlgorithms.JDE0tab2000;
            Y = (year - 2000) / 1000;
        }

        JDE0 = JDE0tab[which][0] +
            (JDE0tab[which][1] * Y) +
            (JDE0tab[which][2] * Y * Y) +
            (JDE0tab[which][3] * Y * Y * Y) +
            (JDE0tab[which][4] * Y * Y * Y * Y);
        T = (JDE0 - 2451545.0) / 36525;
        W = (35999.373 * T) - 2.47;
        deltaL = 1 + (0.0334 * AstronomicalAlgorithms.dcos(W)) + (0.0007 * AstronomicalAlgorithms.dcos(2 * W));
        S = 0;
        for (i = j = 0; i < 24; i++) {
            S += AstronomicalAlgorithms.EquinoxpTerms[j] * AstronomicalAlgorithms.dcos(AstronomicalAlgorithms.EquinoxpTerms[j + 1] + (AstronomicalAlgorithms.EquinoxpTerms[j + 2] * T));
            j += 3;
        }
        JDE = JDE0 + ((S * 0.00001) / deltaL);
        return JDE;
    },
    sunpos(jd) {
        let T, T2, L0, M, e, C, sunLong, sunAnomaly, sunR,
            Omega, Lambda, epsilon, epsilon0, Alpha, Delta,
            AlphaApp, DeltaApp;

        T = (jd - AstronomicalAlgorithms.J2000) / AstronomicalAlgorithms.JulianCentury;
        T2 = T * T;
        L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
        L0 = AstronomicalAlgorithms.fixangle(L0);
        M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
        M = AstronomicalAlgorithms.fixangle(M);
        e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
        C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * AstronomicalAlgorithms.dsin(M)) +
            ((0.019993 - (0.000101 * T)) * AstronomicalAlgorithms.dsin(2 * M)) +
            (0.000289 * AstronomicalAlgorithms.dsin(3 * M));
        sunLong = L0 + C;
        sunAnomaly = M + C;
        sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * AstronomicalAlgorithms.dcos(sunAnomaly)));
        Omega = 125.04 - (1934.136 * T);
        Lambda = sunLong + (-0.00569) + (-0.00478 * AstronomicalAlgorithms.dsin(Omega));
        epsilon0 = AstronomicalAlgorithms.obliqeq(jd);
        epsilon = epsilon0 + (0.00256 * AstronomicalAlgorithms.dcos(Omega));
        Alpha = AstronomicalAlgorithms.rtd(Math.atan2(AstronomicalAlgorithms.dcos(epsilon0) * AstronomicalAlgorithms.dsin(sunLong), AstronomicalAlgorithms.dcos(sunLong)));
        Alpha = AstronomicalAlgorithms.fixangle(Alpha);
        Delta = AstronomicalAlgorithms.rtd(Math.asin(AstronomicalAlgorithms.dsin(epsilon0) * AstronomicalAlgorithms.dsin(sunLong)));
        AlphaApp = AstronomicalAlgorithms.rtd(Math.atan2(AstronomicalAlgorithms.dcos(epsilon) * AstronomicalAlgorithms.dsin(Lambda), AstronomicalAlgorithms.dcos(Lambda)));
        AlphaApp = AstronomicalAlgorithms.fixangle(AlphaApp);
        DeltaApp = AstronomicalAlgorithms.rtd(Math.asin(AstronomicalAlgorithms.dsin(epsilon) * AstronomicalAlgorithms.dsin(Lambda)));

        return [                 //  Angular quantities are expressed in decimal degrees
            L0,                           //  [0] Geometric mean longitude of the Sun
            M,                            //  [1] Mean anomaly of the Sun
            e,                            //  [2] Eccentricity of the Earth's orbit
            C,                            //  [3] Sun's equation of the Centre
            sunLong,                      //  [4] Sun's true longitude
            sunAnomaly,                   //  [5] Sun's true anomaly
            sunR,                         //  [6] Sun's radius vector in AU
            Lambda,                       //  [7] Sun's apparent longitude at true equinox of the date
            Alpha,                        //  [8] Sun's true right ascension
            Delta,                        //  [9] Sun's true declination
            AlphaApp,                     // [10] Sun's apparent right ascension
            DeltaApp                      // [11] Sun's apparent declination
        ];
    },
    equationOfTime(jd) {
        let alpha, deltaPsi, E, epsilon, L0, tau;
        tau = (jd - AstronomicalAlgorithms.J2000) / AstronomicalAlgorithms.JulianMillennium;
        L0 = 280.4664567 + (360007.6982779 * tau) +
            (0.03032028 * tau * tau) +
            ((tau * tau * tau) / 49931) +
            (-((tau * tau * tau * tau) / 15300)) +
            (-((tau * tau * tau * tau * tau) / 2000000));
        L0 = AstronomicalAlgorithms.fixangle(L0);
        alpha = AstronomicalAlgorithms.sunpos(jd)[10];
        deltaPsi = AstronomicalAlgorithms.nutation(jd)[0];
        epsilon = AstronomicalAlgorithms.obliqeq(jd) + AstronomicalAlgorithms.nutation(jd)[1];
        E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * AstronomicalAlgorithms.dcos(epsilon));
        E = E - 20.0 * (Math.floor(E / 20.0));
        E = E / (24 * 60);
        return E;
    },
};
