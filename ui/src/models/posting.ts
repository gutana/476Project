import { Grade, PrimarySchoolSubject, SchoolType, SecondarySchoolSubject } from "./school";


export interface Post {
    id: string,
    posterId: string,
    schoolId: string,

    schoolName: string,
    schoolType: SchoolType,

    postTitle: string,
    postDescription: string,

    primarySchoolSubjects?: PrimarySchoolSubject[],
    secondarySchoolSubjec?: SecondarySchoolSubject[],
    grades?: Grade[],

}