import { Region } from "./user";

export interface School {
    id: string,
    posterId: string,
    schoolType: SchoolType,
    schoolName: string,
    phoneNumber: string,
    address: string,
    city: string,
    postalCode: string,
    region: Region
}

export enum SchoolType {
    Primary = "Primary",
    Secondary = "Secondary"
}