import { NewsPost } from "../../models/news";
import { Endpoints } from "../../utils/ApiURLs";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function LatestNewsQuery() {
    const response = await AuthedFetch('GET', Endpoints.NEWS.GET_LATEST);

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as NewsPost[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}