import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL } from "../../components/consts";

export interface PostNewsData {
    Title: string,
    Content: string
}

export async function PostNewsMutation(data: PostNewsData, retries=0): Promise<boolean> {
    const response = await fetch(baseServerURL + '/news/create', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        return true;
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await PostNewsMutation(data, retries + 1);
        return res;
    } else if (response.status === 500) {
        const text = await response.text();
        const reason = JSON.parse(text).detail;
        throw reason;
    } else {
        console.log("Error posting news...");
        console.log(response.body);
        throw new Error();
    }
}