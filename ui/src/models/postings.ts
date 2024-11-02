import { School, SchoolType } from "./schools";
import { User } from "./user";

export interface CreatePostData
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
    poster: User,
    acceptedByUser: User | null,
    school: School,
    schoolType: SchoolType,
    postDescription: string,
    requestedSub: User,
    private: boolean,
    postDateTime: Date,
    primarySchoolSubjects: PrimarySchoolSubject[] | null,
    secondarySchoolSubjects: SecondarySchoolSubject[] | null,
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