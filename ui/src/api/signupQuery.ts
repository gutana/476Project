export interface RegistrationRequest
{
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string,
    Region: Region,
    UserType: UserType
}

export enum Region {
    Regina, 
    Saskatoon
}

export enum UserType {
    Teacher, 
    Requestor,
    Administrator
}

export async function Signup(regRequest: RegistrationRequest) {
    const response = await fetch('http://localhost:5075/account/register', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
            FirstName: regRequest.FirstName,
            LastName: regRequest.LastName,
            Email: regRequest.Email,
            Password: regRequest.Password,
            Region: regRequest.Region.toString(),
            UserType: regRequest.UserType.toString()
        })
    });
    if (response.status == 200)
        return "success";
    else 
        return "failure";
}