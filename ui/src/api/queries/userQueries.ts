import { User } from "../../models/user";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function userQuery() {
    const response = await AuthedFetch('GET', '/account/getUser');

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as User;
    }
    else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}