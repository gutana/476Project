import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";
import { User } from "../../models/user";

export async function subQuery(retries=0) : Promise<User[] | undefined> {
    const response = await fetch(baseServerURL + '/post/getApprovedSubs', {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as User[];
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await subQuery(retries + 1);
        throw repititionError;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}