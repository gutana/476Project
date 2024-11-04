import { CreatePostData } from "../../models/postings";
import { AuthedFetch } from "../../utils/AuthedFetch";
import { Endpoints } from "../../utils/ApiURLs";

export async function AddPostingMutation(request: CreatePostData) {
    const response = await AuthedFetch('POST', Endpoints.POST.ADD_POSTING, JSON.stringify(request));

    if (response.status === 200) {
        const text = await response.text();
        return text;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}