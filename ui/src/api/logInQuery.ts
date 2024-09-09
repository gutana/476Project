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

export async function LogInQuery(logInRequest: LogInRequest) {

    const response = await fetch('http://localhost:5075/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logInRequest)
    });

    if (response.status == 200) {
        console.log("Log in successful!");
        const text = await response.text();
        return await JSON.parse(text) as LogInResult;
    }
    else {
        console.log("Error logging in...");
        console.log(response.body);
        return null;
    }
}