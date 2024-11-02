import { Region } from "./user";

export interface School {
    id: string,
    name: string,
    schoolType: SchoolType,
    phoneNumber: string,
    address: string,
    city: string,
    postalCode: string,
    region: Region
}

export enum SchoolType {
    Primary,
    Secondary
}

export enum PrimarySchoolSubject {
    FrenchImmersion,
    CoreFrench,
    ArtsEd,
    General
}

export enum SecondarySchoolSubject // TODO: ADD ALL 
{
    English,
    Math,
    Science,
    History,
    SocialStudies
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