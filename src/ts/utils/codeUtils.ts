export function isUndefined(o : any) : boolean {
    return typeof o === "undefined";
}

export const isArray : (o : any) => boolean = Array.isArray || function name(o : any): boolean {
    return toString.call(o) === "[object Array]";
};

export function isString(o : any) : boolean {
    return toString.call(o) === "[object String]";
}

export function isNumber(o : any) : boolean {
    return toString.call(o) === "[object Number]" && !isNaN(o);
}

export function isBoolean(o : any) : boolean {
    return toString.call(o) === "[object Boolean]";
}

export function isFunction(o : any) : boolean {
    return typeof o === "function";
}

export function isObject(o : any) : boolean {
    return typeof o === "object" && !!o;
}

export function isEmpty(o : any) : boolean {
    if (o === null || isUndefined(o)) {
        return true;
    }

    if (isArray(o) || isString(o)) {
        return o.length === 0;
    }

    return Object.keys(o).length === 0;
}

export function contains(a : Array<any>, o : any) : boolean {
    return a.indexOf(o) >= 0;
}

export function filter(a : Array<any>, f : (v : any, i? : number | string) => Array<any>) : Array<any> {
    return a.filter(f);
}

export function leftPad(s : string | number, length : number, c? : string) : string {
    return Array(length + 1 - s.toString().length).join(c ? c[0] : "0") + s;
}

export function debounce(func, wait) {
    let timeout;

    // tslint:disable-next-line:only-arrow-functions
    return function() {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
