import { Region, UserType } from "../../models/user";
import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL } from "../../components/consts";

// LOG IN MUTATION

export interface LogInRequest {
    Email: string,
    Password: string,
}

export interface RefreshRequest {
    refreshToken: string
}

export interface LogInResult {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

export async function LogInMutation(logInRequest: LogInRequest) {

    const response = await fetch(baseServerURL + '/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logInRequest)
    });

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    }
    else {
        console.log("Error logging in...");
        console.log(response.body);
        throw new Error();
    }
}

export async function RefreshMutation(body: RefreshRequest) {
    const url = baseServerURL + '/refresh';
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }

    const response = await fetch(url, options);
    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    } else {
        return null;
    }
}

// REGISTRATION MUTATION

export interface RegistrationRequest {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string,
    PhoneNumber: string,
    Region: Region,
    UserType: UserType
}

export async function RegistrationMutation(regRequest: RegistrationRequest) {
    const response = await fetch(baseServerURL + '/account/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regRequest)
    });

    if (response.status === 200) {
        return true;
    }
    else {
        console.log("Error signing up...");
        console.log(response.body);
        throw new Error();
    }
}

// EDIT MUTATION
export interface EditInformation {
    FirstName: string,
    LastName: string,
    Email: string,
    PhoneNumber: string,
    Region: Region,
}

export async function EditInformationMutation(request: EditInformation, retries=0) : Promise<boolean> {
    const url = baseServerURL + '/account/editInfo';
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(url, options);
    if (response.status === 200) {
        return true;
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await EditInformationMutation(request, retries + 1);
        return res;
    } else if (response.status === 500) {
        const text = await response.text();
        const reason = JSON.parse(text).detail;
        throw reason;
    } else {
        console.error(response.body)
        throw new Error();
    }
}