import { CreatePostData } from "../../models/postings";
import { AuthedFetch } from "../../utils/AuthedFetch";
import { Endpoints } from "../../utils/ApiURLs";
import { json } from "stream/consumers";

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

export async function AcceptPostingMutation(postId: string) {
    const response = await AuthedFetch('POST', Endpoints.POST.ACCEPT_POSTING + "?postId=" + postId);

    if (response.status === 200) {
        return true;
    } else if (response.status === 420) {
        const text = "Post has already been taken.";
        throw new Error(text, {cause: 420});
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function CancelPostingMutation(postId: string) {
    const response = await AuthedFetch('POST', Endpoints.POST.CANCEL_POSTING + "?postId=" + postId);

    if (response.status == 200) {
        return true;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}