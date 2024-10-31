import { Region } from "./user";

export interface School {
    Id: string,
    PosterId: string,
    SchoolType: SchoolType,
    SchoolName: string,
    PhoneNumber: string,
    Address: string,
    City: string,
    PostalCode: string,
    Region: Region
}

export enum SchoolType {
    Primary,
    Secondary,
}