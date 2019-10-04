const BACKEND_URL = "https://24a73e78.ngrok.io";

export default function request(path, method, body, headers) {
    headers = new Headers(headers);
    return fetch(BACKEND_URL + path, {
        method,
        body: JSON.stringify(body),
        headers
    });
}