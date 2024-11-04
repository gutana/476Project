import { User } from "../../models/user";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function subQuery() {
    const response = await AuthedFetch(' ', '/post/getApprovedSubs');

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as User[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}