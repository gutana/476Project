import { PrimarySchoolCourse, SecondarySchoolCourse } from "./courseSchedule";
import { School, SchoolType } from "./schools";
import { User } from "./user";

export interface CreatePostData {
    schoolId: string,
    postDescription: string,
    requestedSub: string,
    private: boolean,
    startDateOfAbsence: Date,
    endDateOfAbsence?: Date,
    absenceType: AbsenceType,
    amPm: AMPM | null,
    primarySchoolSubjects: string[] | null,
    secondarySchoolSubjects: string[] | null,
    grades?: Grade[]
}

export interface Post {
    id: string,
    posterId: string,
    posterFirstName: string,
    posterLastName: string,
    acceptedByUserId: string | null,
    acceptedByUserFirstName: string | null,
    acceptedByUserLastName: string | null,
    school: School,
    schoolType: SchoolType,
    postDescription: string,
    requestedSubFirstName: string | null,
    requestedSubLastName: string | null,
    private: boolean,
    postDateTime: string,
    dateOfAbsence: string,
    absenceType: AbsenceType,
    amPm: AMPM | null,
    primarySchoolSubjects: PrimarySchoolCourse[] | null,
    secondarySchoolSubjects: SecondarySchoolCourse[] | null,
    grades: Grade[]
}

export enum Grade {
    PreK,
    Kindergarten,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve
}

export const MapGradeNameToGrade = (gradeName: string) => {
    switch (gradeName) {
        case "PreK": return Grade.PreK;
        case "Pre-K": return Grade.PreK;
        case "Kindergarten": return Grade.Kindergarten;
        case "One": return Grade.One;
        case "Two": return Grade.Two;
        case "Three": return Grade.Three;
        case "Four": return Grade.Four;
        case "Five": return Grade.Five;
        case "Six": return Grade.Six;
        case "Seven": return Grade.Seven;
        case "Eight": return Grade.Eight;
        case "Nine": return Grade.Nine;
        case "Ten": return Grade.Ten;
        case "Eleven": return Grade.Eleven;
        case "Twelve": return Grade.Twelve;
    }
    throw `Error: Unexpected string: ${gradeName} trying to convert to Grade Enum`;
}

export type AMPM = "AM" | "PM" 

export enum AbsenceType {
    HalfDay,
    FullDay,
    MultipleDays
}

export const MapAbsenceTypeStringToAbsenceType = (absenceType: string) => {
    switch (absenceType) {
        case "Half-Day": return AbsenceType.HalfDay;
        case "Full-Day": return AbsenceType.FullDay;
        case "Multiple Days": return AbsenceType.MultipleDays;
    }
    throw `Error: Unexpected string: ${absenceType} trying to convert to AbsenceType Enum`;
}

export const MapSchoolSubjectToString = (subject: string) => {
    switch (subject) {
        case "FrenchImmersion": return "French Immersion";
        case "CoreFrench": return "Core French";
        case "ArtsEd": return "Arts Ed";
        case "General": return "General";
        case "English": return "English";
        case "Math": return "Math";
        case "Science": return "Science";
        case "History": return "History";
        case "SocialStudies": return "Social Studies";
    }
}

export enum PrimarySchoolSubject {
    FrenchImmersion,
    CoreFrench,
    ArtsEd,
    General
}

export enum SecondarySchoolSubject {
    English,
    Math,
    Science,
    History,
    SocialStudies
}