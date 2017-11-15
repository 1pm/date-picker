
export const isArray : (o : any) => boolean = Array.isArray || function name(o : any) : boolean {
    return toString.call(o) === "[object Array]";
};

export function isUndefined(o : any) : boolean {
    return typeof o === "undefined";
}

export function isString(o : any) : boolean {
    return typeof o === "string";
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
