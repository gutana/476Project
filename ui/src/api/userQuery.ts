import { Region, UserType } from "./signupQuery";

export interface UserResult {
    firstName: string,
    lastName: string,
    region: Region,
    userType: UserType,
    id: string,
    email: string,
    phoneNumber?: string,
}

export async function userQuery() {
    // TODO: Should have an abstraction for authed query
    const response = await fetch('https://localhost:7287/account/getUser', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
    });

    if (response.status == 200) {
        const text = await response.text();
        return await JSON.parse(text) as UserResult;
    }
    else {
        console.log("Error fetching user...");
        console.log(response.body);
        return null;
    }
}