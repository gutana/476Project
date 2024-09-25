import { User } from "../../models/user";

export async function accountQuery() {
    const response = await fetch("https://localhost:7287/admin/getUnapprovedUsers", {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })

    if (response.status === 200) {
        const text = await response.text();
        return JSON.parse(text) as User[];
    } else if (response.status === 401) {
        window.location.href = "/login";
        return;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}