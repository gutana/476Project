import { baseServerURL } from "./ApiURLs"

export const AuthedFetch = (method: string, endpoint: string, body?: string) => {

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${sessionStorage.getItem('accessToken')}`);

    if (body != undefined)
        headers.append('Content-Type', 'application/json');

    return fetch(baseServerURL + endpoint, {
        method: method,
        headers: headers,
        body: body
    })
}

