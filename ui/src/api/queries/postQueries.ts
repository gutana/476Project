import { Post } from "../../models/postings";
import { Endpoints } from "../../utils/ApiURLs";
import { AuthedFetch } from "../../utils/AuthedFetch";

export async function GetPostsByUser() {
    const response = await AuthedFetch('GET', Endpoints.POST.GET_BY_USER);

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as Post[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function GetAvailablePosts() {
    const response = await AuthedFetch('GET', Endpoints.POST.GET_AVAILABLE);

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as Post[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function GetTakenPosts() {
    const response = await AuthedFetch('GET', Endpoints.POST.GET_TAKEN_BY_USER);

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as Post[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function GetAllPosts() {
    const response = await AuthedFetch('GET', Endpoints.POST.GET_ALL)

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as Post[];
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}