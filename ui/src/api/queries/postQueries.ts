import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";
import { Post } from "../../models/postings";

export async function postQuery(retries=0) : Promise<Post[] | undefined> {
    const response = await fetch(baseServerURL + '/post/getPostings', {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as Post[];
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await postQuery(retries + 1);
        throw repititionError;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}