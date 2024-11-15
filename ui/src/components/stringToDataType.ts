import { PrimarySchoolCourse, SecondarySchoolCourse } from "../models/courseSchedule";
import { Grade, PrimarySchoolSubject, SecondarySchoolSubject } from "../models/postings";
import { SchoolType } from "../models/schools";
import { Region, UserType } from "../models/user";
import { TypeaheadValue } from "../pages/AddPost";

export const stringToRegion = (region: string | Region | undefined) => {
    if (!(typeof region === "string")) {
        return region;
    }
    switch (region.toLowerCase()) {
        case "regina":
        case "0":
            return Region.Regina;
        case "saskatoon":
        case "1":
            return Region.Saskatoon;
        default:
            return undefined;
    }
}

export const stringToUserType = (userType: string | UserType) => {
    if (!(typeof userType === "string")) {
        return userType;
    }

    switch (userType.toLowerCase()) {
        case "administrator":
            return UserType.Administrator;
        case "substitute":
            return UserType.Substitute;
        case "teacher":
            return UserType.Teacher;
        default:
            return null;
    }
}

export const stringToSchoolType = (schoolType: string | SchoolType) => {
    if (!(typeof schoolType === "string")) {
        return schoolType;
    }
    switch (schoolType.toLowerCase()) {
        case "primary":
        case "0":
            return SchoolType.Primary;
        case "secondary":
        case "1":
            return SchoolType.Secondary;
        default:
            return SchoolType.Primary;
    }
}

export const stringToSecondary = (secondary: string | SecondarySchoolSubject) => {
    if (!(typeof secondary === "string")) {
        return secondary;
    }

    switch (secondary.toLowerCase()) {
        case "English":
        case "0":
            return SecondarySchoolSubject.English
        case "Math":
        case "1":
            return SecondarySchoolSubject.Math
        case "Science":
        case "2":
            return SecondarySchoolSubject.Science
        case "History":
        case "3":
            return SecondarySchoolSubject.History
        case "SocialStudies":
        case "4":
            return SecondarySchoolSubject.SocialStudies
        default:
            return null
    }
}

export const stringToPrimary = (primary: string | PrimarySchoolSubject) => {
    if (!(typeof primary === "string")) {
        return primary;
    }

    switch (primary.toLowerCase()) {
        case "FrenchImmersion":
        case "0":
            return PrimarySchoolSubject.FrenchImmersion
        case "CoreFrench":
        case "1":
            return PrimarySchoolSubject.CoreFrench
        case "ArtsEd":
        case "2":
            return PrimarySchoolSubject.ArtsEd
        case "General":
        case "3":
            return PrimarySchoolSubject.General
        default:
            return null
    }
}

export const stringToGrades= (grade: string | Grade) => {
    if (!(typeof grade === "string")) {
        return grade;
    }
    
    switch (grade.toLowerCase()) {
        case "PreK":
        case "0":
            return Grade.PreK
        case "Kindergarten":
        case "1":
            return Grade.Kindergarten
        case "One":
        case "2":
            return Grade.One
        case "Two":
        case "3":
            return Grade.Two
        case "Three":
        case "4":
            return Grade.Three
        case "Four":
        case "5":
            return Grade.Four
        case "Five":
        case "6":
            return Grade.Five
        case "Six":
        case "7":
            return Grade.Six
        case "Seven":
        case "8":
            return Grade.Seven
        case "Eight":
        case "9":
            return Grade.Eight
        case "Nine":
        case "10":
            return Grade.Nine
        case "Ten":
        case "11":
            return Grade.Ten
        case "Eleven":
        case "12":
            return Grade.Eleven
        case "Twelve":
        case "13":
            return Grade.Twelve
        default:
            return null
    }
}

export const translateToSchoolTypeahead = (vals: any[]) => {
    let translated: TypeaheadValue[] = [];
    for (let i = 0; i < vals.length; i++) {
        const item = vals[i];
        translated.push({ name: item.schoolName, value: item.id });
    }
    
    return translated;
}

export const translateGrade = (grades: TypeaheadValue[], primary?: boolean): any => {
    if (grades.length === 0) return -1;
    let translatedGrade: Grade[] = [];
    let gradesValue: string[] = [];

    grades.forEach(grade => {
        gradesValue.push(grade.value);
    })

    for (let i = 0; i < gradesValue.length; i++) {
        let grade = gradesValue[i];
        let translated = stringToGrades(grade);
        if (translated === null) return -1;
        if (primary !== undefined) {
            if (Number(grade) > 9 && primary) return -2;
            if (Number(grade) < 10 && !primary) return -3;
        }
        translatedGrade.push(translated);
    }

    return translatedGrade;
}

export const translatePrimary = (primary: TypeaheadValue[]): any => {
    let translatedPrimary: PrimarySchoolSubject[] = [];
    let primaryValue: string[] = [];
    primary.forEach(p => {
        primaryValue.push(p.value);
    })

    for (let i = 0; i < primaryValue.length; i++) {
        let p = primaryValue[i];
        let translated = stringToPrimary(p);
        if (translated === null) return -1;
        translatedPrimary.push(translated);
    }

    return translatedPrimary;
}

export const translateCourses = (courses: TypeaheadValue[]): any => {
    let courseValue: string[] = [];    
    courses.forEach(p => {
        courseValue.push(p.value);
    })

    return courseValue;
}

export const translateSecondary = (secondary: TypeaheadValue[]): any => {
    let translatedSecondary: SecondarySchoolSubject[] = [];
    let secondaryValue: string[] = [];
    secondary.forEach(s => {
        secondaryValue.push(s.value);
    })

    for (let i = 0; i < secondaryValue.length; i++) {
        let s = secondaryValue[i];
        let translated = stringToSecondary(s);
        if (translated === null) return -1;
        translatedSecondary.push(translated);
    }

    return translatedSecondary;
}

export const translateTime = (time: string) => {
    let dateTime = new Date(time);
    return dateTime.getUTCHours() + ":" + dateTime.getUTCMinutes() + dateTime.toLocaleTimeString().slice(-3);
}