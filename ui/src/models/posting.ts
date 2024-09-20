import { Grade, PrimarySchoolSubject, SchoolType, SecondarySchoolSubject } from "./school";


export interface Post {
    Id: string,
    PosterId: string,
    SchoolId: string,

    SchoolName: string,
    SchoolType: SchoolType,

    PostDescription: string,

    PrimarySchoolSubjects?: PrimarySchoolSubject[],
    SecondarySchoolSubjec?: SecondarySchoolSubject[],
    Grades?: Grade[],

}