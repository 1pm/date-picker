import {ElementPosition} from "../types/ElementPosition";
import {CreateElementOptions} from "../types/CreateElementOptions";

export function createElement<T extends HTMLElement>(tag : string, classNames? : string | Array<string>, content? : string | CreateElementOptions) : T {
    const element : T = window.document.createElement(tag) as T;

    if (typeof classNames === "string") {
        addClass(element, classNames);
    } else if (Array.isArray(classNames)) {
        for (const className of classNames) {
            addClass(element, className);
        }
    }

    if (typeof content === "string") {
        element.innerHTML = content;
    } else if (typeof content === "object") {
        if (content.content) {
            element.innerHTML = content.content;
        }

        if (content.attributes) {
            for (const attributeName of Object.keys(content.attributes)) {
                element[attributeName] = content.attributes[attributeName];
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
