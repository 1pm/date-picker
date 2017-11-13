export function createElement<T extends HTMLElement>(tag : string, className? : string, content? : string): T {
    const element : T = window.document.createElement(tag) as T;

    if (!!className) {
        element.className = className;
    }

    if (!!content) {
        element.innerHTML = content;
    }

    return element;
}
