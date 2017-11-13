import {DayPicker} from "./ts/DayPicker";
import {DayPickerOptions} from "./ts/types/DayPickerOptions";

export function dayPicker(
    targets : HTMLInputElement | Array<HTMLInputElement> | NodeList | string,
    options? : DayPickerOptions
) : DayPicker | Array<DayPicker> {
    if (targets instanceof NodeList || Array.isArray(targets)) {
        return initFromNodeList(targets, options);
    } else if (typeof targets === "string") {
        const nodes : NodeList = window.document.querySelectorAll(targets);

        return initFromNodeList(nodes, options);
    }

    return initFromElement(targets, options);
}

function initFromNodeList(
    targets : NodeList | Array<HTMLInputElement>,
    options : DayPickerOptions
) : Array<DayPicker> {
    const elements : Array<HTMLInputElement> = Array.prototype.slice.call(targets);

    return elements.map((element : HTMLInputElement) => {
        return initFromElement(element, options);
    });
}

function initFromElement(target : HTMLInputElement, options : DayPickerOptions) : DayPicker {
    if (target instanceof HTMLInputElement !== true) {
        console.error("Target is not <input> element");

        return;
    }

    return new DayPicker(target, options);
}

dayPicker("input");