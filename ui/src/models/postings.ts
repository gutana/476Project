import { SchoolType } from "./schools";

export interface PostResp
{
    schoolId: string,
    postDescription: string,
    requestedSub: string,
    private: boolean,
    primarySchoolSubjects: PrimarySchoolSubject[] | null,
    secondarySchoolSubjects: SecondarySchoolSubject[] | null,
    grades: Grade[]
}

export interface Post
{
    id: string,
    posterId: string,
    schoolId: string,
    schoolType: SchoolType,
    postDescription: string,
    requestedSub: string,
    private: boolean,
    postDate: string,
    postTime: string,
    primarySchoolSubjects: PrimarySchoolSubject | null,
    secondarySchoolSubjects: SecondarySchoolSubject | null,
    grades: Grade    
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