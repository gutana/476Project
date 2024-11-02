import { Grade, PrimarySchoolSubject, SchoolType, SecondarySchoolSubject } from "./school";


export interface Post {
    id: string,
    posterId: string,
    posterName: string,
    schoolId: string,

    schoolName: string,
    schoolType: SchoolType,

    postDateOfAbsence: Date,
    
    primarySchoolSubjects?: PrimarySchoolSubject[],
    secondarySchoolSubjec?: SecondarySchoolSubject[],
    grades?: Grade[],

}