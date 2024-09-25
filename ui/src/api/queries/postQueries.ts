import { Post } from "../../models/posting";

export async function GetUserPostings() {

    const response = await fetch('https://localhost:7287/posting/getUserPostings', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as Post[];
    } else if (response.status === 401) {
        return null;
    }
    else {
        console.log("Error fetching posts...");
        console.log(response.body);
        return null;
    }

}