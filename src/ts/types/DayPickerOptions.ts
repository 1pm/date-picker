export interface DayPickerOptions {
    value? : number;
    format? : string;
    onValueChange? : (value : number, oldValue? : number) => void;
}
