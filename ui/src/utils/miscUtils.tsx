export const FormatDateForDisplayAsTimeOnly = (utfDate: string) => {
    const localtime = new LocalTime(utfDate);
    return localtime.GetFormattedStr();

}

export class LocalTime {
    hours: number
    minutes: number;

    constructor(utfDate: string) {
        var time = utfDate.slice(11, 16);
        var split = time.split(':');
        this.hours = parseInt(split[0]);
        this.minutes = parseInt(split[1]);
    }

    GetFormattedStr() {
        let postfix: string = this.hours > 12 ? "PM" : "AM";
        let adjustedHours = postfix === "AM" ? this.hours : this.hours - 12;
        return `${adjustedHours}:${this.minutes.toString().padStart(2, '0')} ${postfix}`;
    }
}