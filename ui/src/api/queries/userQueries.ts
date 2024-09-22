import { User } from "../../models/user";

export async function userQuery() {
    // TODO: Should have an abstraction for authed query
    const response = await fetch('https://localhost:7287/account/getUser', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as User;
    } else if (response.status === 401) {
        window.location.href = "/login";
        return null;
    }
    else {
        console.log("Error fetching user...");
        console.log(response.body);
        return null;
    }
}