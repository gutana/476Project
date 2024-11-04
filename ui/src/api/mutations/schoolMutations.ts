import { SchoolType } from "../../models/schools";
import { Region } from "../../models/user";
import { Endpoints } from "../../utils/ApiURLs";
import { AuthedFetch } from "../../utils/AuthedFetch";

export interface SchoolInformation {
    SchoolType: SchoolType,
    SchoolName: string,
    PhoneNumber: string,
    Address: string,
    City: string,
    PostalCode: string,
    Region: Region
}

export async function AddSchoolMutation(request: SchoolInformation): Promise<string> {
    const response = await AuthedFetch('POST', Endpoints.SCHOOL.ADD_SCHOOL, JSON.stringify(request));

    if (response.status === 200) {
        const text = await response.text();
        return text;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}