export interface DayPickerValue {
    dayPickerValue? : number;
}

export type HTMLDayPickerElement<T> = T & DayPickerValue;
