import { baseServerURL, repititionError } from "../../components/consts";
import { getRefresh } from "../../components/UserWrapper";
import { CreatePostData } from "../../models/postings";

export async function AddPostingMutation(request: CreatePostData, retries=0) : Promise<string> {
    const url = baseServerURL + '/post/addPosting';
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
        if (res) return await AddPostingMutation(request, retries + 1);
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