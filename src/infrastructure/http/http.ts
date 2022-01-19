
const headers = {
    'Content-Type': 'application/json'
}

export default class Http {

    static async get <T>(url:string) {
        const response = await fetch(url, {
            method: 'GET',
            headers
        })
        return await response.json() as T;
    }

    static async post <T>(url:string, body: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        })
        return await response.json() as T;
    }

    static async put <T>(url:string, body: any) {
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body
        })
        return await response.json() as T;
    }

    static async delete <T>(url:string) {
        const response = await fetch(url, {
            method: 'PUT',
            headers
        })
        return await response.json() as T;
    }

}