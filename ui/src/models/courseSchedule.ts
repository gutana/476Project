import { Grade, PrimarySchoolSubject, SecondarySchoolSubject } from "./postings"

export interface PrimarySchoolCourse {
    id: string,
    subject: PrimarySchoolSubject,
    grades: Grade[],
    startTime: string, // only use the time in these 
    endTime: string
    location?: string | null;
}

export interface SecondarySchoolCourse {
    id: string,
    subject: SecondarySchoolSubject,
    grades: Grade[],
    startTime: string, // only use the time in these 
    endTime: string
    location?: string | null;
}