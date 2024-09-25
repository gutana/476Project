export interface PostNewsData {
    Title: string,
    Content: string
}

export async function PostNewsMutation(data: PostNewsData) {
    const response = await fetch('https://localhost:7287/news/create', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        return true;
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