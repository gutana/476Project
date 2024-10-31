import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";
import { School } from "../../models/schools";

export async function schoolQuery(retries=0) : Promise<School[] | undefined> {
    const response = await fetch(baseServerURL + '/admin/getSchools', {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as School[];
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await schoolQuery(retries + 1);
        throw repititionError;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}