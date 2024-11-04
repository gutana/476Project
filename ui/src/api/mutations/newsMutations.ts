import { AuthedFetch } from "../../utils/AuthedFetch";
import { Endpoints } from "../../utils/ApiURLs";

export interface PostNewsData {
    Title: string,
    Content: string
}

export async function PostNewsMutation(data: PostNewsData) {
    const response = await AuthedFetch('POST', Endpoints.NEWS.CREATE, JSON.stringify(data));

    if (response.status === 200) {
        return true;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}