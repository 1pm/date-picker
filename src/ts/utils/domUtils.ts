import {ElementPosition} from "../types/ElementPosition";

export function createElement<T extends HTMLElement>(tag : string, className? : string, content? : string) : T {
    const element : T = window.document.createElement(tag) as T;

    if (!!className) {
        element.className = className;
    }

    if (!!content) {
        element.innerHTML = content;
    }

    return element;
}

export function addClass(element : HTMLElement, className : string) : void {
    element.classList.add(className);
}

export function removeClass(element : HTMLElement, className : string) : void {
    element.classList.remove(className);
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
