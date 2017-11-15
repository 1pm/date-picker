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
        for (let i; i < classNames.length; i++) {
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

export function getAbsolutePosition(element : HTMLElement) : ElementPosition {
    const rect : ClientRect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
    };
}
