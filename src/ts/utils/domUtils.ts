import {ElementPosition} from "../types/ElementPosition";
import {CreateElementOptions} from "../types/CreateElementOptions";
import {isString, isArray, isObject} from "./codeUtils";

export function createElement<T extends HTMLElement>(
    tag : string,
    classNames? : string | Array<string>,
    options? : string | CreateElementOptions
) : T {
    const element : T = window.document.createElement(tag) as T;

    if (isString(classNames)) {
        addClass(element, classNames as string);
    } else if (isArray(classNames)) {
        for (let i = 0; i < classNames.length; i++) {
            addClass(element, classNames[i]);
        }
    }

    if (isString(options)) {
        element.innerHTML = options as string;
    } else if (isObject(options)) {
        const content : string = (options as CreateElementOptions).content;
        const attributes : any = (options as CreateElementOptions).attributes;

        if (content) {
            element.innerHTML = content;
        }

        if (attributes) {
            for (const attributeName of Object.keys(attributes)) {
                element[attributeName] = attributes[attributeName];
            }
        }
    }

    return element;
}

export function addClass(element : HTMLElement, className : string) : void {
    element.classList.add(className);
}

export function removeClass(element : HTMLElement, className : string) : void {
    element.classList.remove(className);
}

export function hasClass(element : HTMLElement, className : string) : boolean {
    return element.classList.contains(className);
}

export function getAbsolutePosition(target : HTMLElement, root : HTMLElement) : ElementPosition {
    const rect : ClientRect = target.getBoundingClientRect();
    const width : number = root.offsetWidth;
    const height : number = root.offsetHeight;

    const distFromTop : number = rect.top + window.scrollY;
    const distFromBottom : number = document.body.scrollHeight - distFromTop - rect.height;
    const distFromLeft : number = rect.left + window.scrollX;
    const distFromRight : number = document.body.scrollWidth - distFromLeft;

    let top = 0;
    let left = 0;

    if (distFromBottom < height && distFromTop >= height) {
        top = distFromTop - height - 5;
    } else {
        top = distFromTop + rect.height + 5;
    }

    if (distFromRight < width && distFromLeft >= width) {
        left = distFromLeft + rect.width - width;
    } else {
        left = distFromLeft;
    }

    return {top, left, width, height};
}
