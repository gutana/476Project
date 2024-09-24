import { NewsPost } from "../../models/news";

export async function LatestNewsQuery() {
    // TODO: Should have an abstraction for authed query
    const response = await fetch('https://localhost:7287/news/getLatest', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as NewsPost[];
    } else if (response.status === 401) {
        return null;
    }
    else {
        console.log("Error fetching news...");
        console.log(response.body);
        return null;
    }
}