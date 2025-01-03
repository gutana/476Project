import { PrimarySchoolCourse, SecondarySchoolCourse } from "./courseSchedule"
import { School } from "./schools"

export interface User {
    firstName: string,
    lastName: string,
    region: Region,
    school?: School,
    userType: UserType,
    id: string,
    email: string,
    phoneNumber: string,
    primarySchoolCourses: PrimarySchoolCourse[],
    secondarySchoolCourses: SecondarySchoolCourse[]
}

export interface Substitute {
    id: string,
    name: string,
    region: Region
}

export enum Region {
    Regina,
    Saskatoon
}

export enum UserType {
    Teacher = "Teacher",
    Substitute = "Substitute",
    Administrator = "Administrator"
}