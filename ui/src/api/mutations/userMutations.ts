import { error } from "console";
import { Region, UserType } from "../../models/user";

// LOG IN MUTATION

export interface LogInRequest {
    Email: string,
    Password: string,
}

export interface LogInResult {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

export async function LogInMutation(logInRequest: LogInRequest) {

    const response = await fetch('https://localhost:7287/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logInRequest)
    });

    if (response.status == 200) {
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    }
    else {
        console.log("Error logging in...");
        console.log(response.body);
        throw new Error();
    }
}

// REGISTRATION MUTATION

export interface RegistrationRequest {
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string,
    Region: Region,
    UserType: UserType
}

export async function RegistrationMutation(regRequest: RegistrationRequest) {
    const response = await fetch('https://localhost:7287/account/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            FirstName: regRequest.FirstName,
            LastName: regRequest.LastName,
            Email: regRequest.Email,
            Password: regRequest.Password,
            Region: regRequest.Region.toString(),
            UserType: regRequest.UserType.toString()
        })
    });

    if (response.status == 200) {
        return true;
    }
    else {
        console.log("Error signing up...");
        console.log(response.body);
        throw new Error();
    }
}