export async function sendRequest(methode: string, objectToSend: object, route: string, parameter?: string) {
    try {
        const urlWithoutRoute = `${window.location.protocol}//${window.location.host}`;

        const version = "api/v1"
        var url = `${urlWithoutRoute}/${version}/${route}`

        const request: RequestInit = {
            method: methode,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        if (methode !== "GET") {
            request.body = JSON.stringify(objectToSend)
        }

        if (parameter) {
            console.log("Fetch: " + parameter)
            const params = new URLSearchParams({ date: parameter}) 
            url = `${url}?${params}`
        }

        const response = await fetch(url, request)

        const data = await response.json()

        if (!response.ok) {
            throw new Error(`HTTP error! ${response.status} - ${response.body}`)
        }

        return data
    }
    catch (err) {
        throw err
    }
}


export function dateToString(date: Date) {
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();

return `${day}.${month}.${year}`
}