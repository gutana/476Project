import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";
import { School } from "../../models/schools";
import { Region } from "../../models/user";

export async function GetSchoolsByRegion(region: Region) {
    const response = await fetch(baseServerURL + `/school/getByRegion?region=${region}`, {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

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