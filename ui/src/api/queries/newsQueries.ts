import { NewsPost } from "../../models/news";
import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";

export async function LatestNewsQuery(retries=0): Promise<NewsPost[] | null> {
    // TODO: Should have an abstraction for authed query
    const response = await fetch(baseServerURL + '/news/getLatest', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as NewsPost[];
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await LatestNewsQuery(retries + 1);
        throw repititionError;
    }
    else {
        console.log("Error fetching news...");
        console.log(response.body);
        return null;
    }
}