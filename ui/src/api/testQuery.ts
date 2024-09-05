export interface HelloResponse {
    response: string
}

export async function GetHello() {
    const response = await fetch('http://localhost:5075/hello/hello');
    const text = await response.text();
    return await JSON.parse(text) as HelloResponse;
}