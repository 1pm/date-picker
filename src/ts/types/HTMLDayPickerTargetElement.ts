import {DayPicker} from "../DayPicker";

export interface DayPickerTarget {
    dayPicker? : DayPicker;
}

export type HTMLDayPickerTargetElement<T> = T & DayPickerTarget;
