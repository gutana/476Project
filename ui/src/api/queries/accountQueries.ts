import { User } from "../../models/user";
import { Endpoints } from "../../utils/ApiURLs";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function accountQuery() {
    const response = await AuthedFetch('GET', Endpoints.ADMIN.GET_UNAPPROVED_USERS);

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as User[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}