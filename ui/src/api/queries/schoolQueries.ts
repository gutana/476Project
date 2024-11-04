import { baseServerURL } from "../../utils/ApiURLs";
import { School } from "../../models/schools";
import { Region } from "../../models/user";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function GetSchoolsByRegion(region: Region) {
    const response = await AuthedFetch('GET', `/school/getByRegion?region=${region}`);

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as School[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function GetAllSchools() {
    const response = await fetch(baseServerURL + '/school/getAllSchools');

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as School[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}