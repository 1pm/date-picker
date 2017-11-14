export function isFlatDiff(obj1 : object, obj2 : object) : boolean {
    const keys1 : Array<string> = Object.keys(obj1);
    const keys2 : Array<string> = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return true;
    }

    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return true;
        }
    };

    return false;
}
