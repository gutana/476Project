import { Grade, PrimarySchoolSubject, SecondarySchoolSubject } from "../models/postings";
import { SchoolType } from "../models/schools";
import { Region } from "../models/user";

export const stringToRegion = (region: string | Region) => {
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
            return Region.Regina;
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