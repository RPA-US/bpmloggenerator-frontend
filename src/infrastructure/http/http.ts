import configuration from "infrastructure/util/configuration";

const commonHeaders = {
    'Content-Type': 'application/json',
    // 'Credentials': 'include',
    // 'Accept': 'application/json',
}

const body = (bodyObj: any) => {
    if (bodyObj != null) {
        if (bodyObj instanceof FormData) return bodyObj;
        else return JSON.stringify(bodyObj);
    }
    return undefined
};

const handleRequestResponse = async <T>(response: Response) => {
    console.log('response', response, response.headers);
    if (response.ok) {
        return await response.json() as T;
    } else {
        return Promise.reject(response);
    }
}

export default class Http {

    static request(method: string, url: string, headers?:any, body?: any) {
        return fetch(url, {
            method,
            headers,
            body
        });
    }

    static async get <T>(url:string, headers?:any) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...commonHeaders,
                ...headers,
            }
        })
        return handleRequestResponse<T>(response);
    }

    static async post <T>(url:string, bodyObj: any, headers?: any) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(bodyObj instanceof FormData ? {} : commonHeaders),
                    ...headers,
                },
                body: body(bodyObj)
            })
            return handleRequestResponse<T>(response);
        } catch (ex) {
            throw ex;
        }
    }

    static async put <T>(url:string, bodyObj: any, headers?: any) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...commonHeaders,
                ...headers,
            },
            body: body(bodyObj)
        })
        return handleRequestResponse<T>(response);
    }

    static async delete <T>(url:string, headers?: any) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...commonHeaders,
                ...headers,
            }
        })
        return handleRequestResponse<T>(response);
    }

    static authHeader(token: string):{ Authorization: string } {
        return { Authorization: `token ${token}` };
    }

    static buildURL = (path:string, queryParams:any = {}) => {
        const params = Object.entries(queryParams).map(p => `${p[0]}=${p[1]}`).join('&');
        let parsedPath = path.startsWith('/') ? path.substring(1) : path;
        return configuration.API_BASE_URL + parsedPath + (params !== '' ? `?${params}` : '');
    }
      

}