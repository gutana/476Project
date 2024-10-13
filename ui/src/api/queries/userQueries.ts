import { User } from "../../models/user";
import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL } from "../../components/consts";

export async function userQuery(retries=0) : Promise<User | null> {
    // TODO: Should have an abstraction for authed query
    const response = await fetch(baseServerURL + '/account/getUser', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as User;
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await userQuery(retries + 1);
        return null;
    }
    else {
        console.log("Error fetching user...");
        console.log(response.body);
        return null;
    }
}