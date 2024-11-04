import { Region, UserType } from "../../models/user";
import { Endpoints } from "../../utils/ApiURLs";
import { AuthedFetch } from "../../utils/AuthedFetch";

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
    const response = await AuthedFetch('POST', Endpoints.LOG_IN, JSON.stringify(logInRequest));

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    }
    else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function RefreshMutation(body: RefreshRequest) {
    const response = await AuthedFetch('POST', Endpoints.REFRESH, JSON.stringify(body));

    if (response.status === 200) {
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
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
    SchoolId: string,
    UserType: UserType
}

export async function RegistrationMutation(regRequest: RegistrationRequest) {
    const response = await AuthedFetch('POST', Endpoints.ACCOUNT.REGISTER, JSON.stringify(regRequest));

    if (response.status === 200) {
        return true;
    }
    else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

// EDIT MUTATION
export interface EditInformation {
    FirstName: string,
    LastName: string,
    Email: string,
    PhoneNumber: string,
    Region: Region,
    SchoolId: string
}

export async function EditInformationMutation(request: EditInformation) {
    const response = await AuthedFetch('POST', Endpoints.ACCOUNT.EDIT_INFO, JSON.stringify(request));

    if (response.status === 200) {
        return true;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}