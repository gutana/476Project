import { Grade } from "../models/postings";

const gradeToNumber = (grade: string) => {
    switch(grade) {
        case "PreK":
        case "0":
            return "Pre-K"
        case "Kindergarten":
        case "1":
            return "Kindergarten"
        case "One":
        case "2":
            return "1"
        case "Two":
        case "3":
            return "2"
        case "Three":
        case "4":
            return "3"
        case "Four":
        case "5":
            return "4"
        case "Five":
        case "6":
            return "5"
        case "Six":
        case "7":
            return "6"
        case "Seven":
        case "8":
            return "7"
        case "Eight":
        case "9":
            return "8"
        case "Nine":
        case "10":
            return "9"
        case "Ten":
        case "11":
            return "10"
        case "Eleven":
        case "12":
            return "11"
        case "Twelve":
        case "13":
            return "12"
        default:
            return null
    }
}

export const FormatDateForDisplayAsTimeOnly = (utfDate: string) => {
    const localtime = new LocalTime(utfDate);
    return localtime.GetFormattedStr();

}

export const translateGradeToNumbers = (grades: Grade[], primary?: boolean): any => {
    if (grades.length === 0) return "";
    let gradesNumber: string[] = [];
    grades.forEach(grade => {
        let translated = gradeToNumber(grade.toString());
        if (translated) gradesNumber.push(translated);
    })

    gradesNumber.sort((a, b) => {
        let aNan = isNaN(Number(a));
        let bNan = isNaN(Number(b));
        
        if (aNan && bNan) {
            return a === "Pre-K" ? -1 : 1;
        } else if (aNan) {
            return -1;
        } else if (bNan) {
            return 1;
        } else {
            return Number(a) < Number(b) ? -1 : 1
        }
    });

    return gradesNumber.join(", ");
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