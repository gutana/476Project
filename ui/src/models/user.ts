export interface User {
    firstName: string,
    lastName: string,
    region: Region,
    userType: UserType,
    id: string,
    email: string,
    phoneNumber: string,
}

export enum Region {
    Regina,
    Saskatoon
}

export enum UserType {
    Teacher = "Teacher",
    Requestor = "Requestor",
    Administrator = "Administrator"
}