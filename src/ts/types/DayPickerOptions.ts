export interface DayPickerOptions {
    value? : number;
    locale? : string;
    format? : string;
    calendar? : string;
    min? : number;
    max? : number;
    hideOnSelect? : boolean;
    isOpen? : boolean;
    onValueChange? : (value : number, oldValue? : number) => void;
}
