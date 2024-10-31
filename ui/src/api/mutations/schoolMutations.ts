import { baseServerURL, repititionError } from "../../components/consts";
import { getRefresh } from "../../components/UserWrapper";
import { SchoolType } from "../../models/schools";
import { Region } from "../../models/user";

export interface SchoolInformation {
    SchoolType: SchoolType,
    SchoolName: string,
    PhoneNumber: string,
    Address: string,
    City: string,
    PostalCode: string,
    Region: Region
}

export async function AddSchoolMutation(request: SchoolInformation, retries=0) : Promise<string> {
    const url = baseServerURL + '/admin/addSchool';
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(url, options);
    if (response.status === 200) {
        const text = await response.text();
        return text;
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await AddSchoolMutation(request, retries + 1);
        throw repititionError;
    } else if (response.status === 500) {
        const text = await response.text();
        const reason = JSON.parse(text).detail;
        throw reason;
    } else {
        console.error(response.body)
        throw new Error();
    }
}