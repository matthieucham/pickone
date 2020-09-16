class FetchError extends Error {
}

class APIService {
    constructor(APIEndpoint) {
        this.APIEndpoint = APIEndpoint;
    }

    callAPIWithAuth(path, accessToken, options = {}) {
        const bearer = `Bearer ${accessToken}`;
        const callOptions = {
            ...options,
            withCredentials: true,
            headers: {
                'content-type': 'application/json',
                ...options.headers,
                Authorization: `${bearer}`,
            },
        };

        return this.callAPI(`${path}`, callOptions);
    }

    callAPI(path, options = {}) {
        const callOptions = {
            'Content-Type': 'application/json',
            ...options,
        };
        return fetch(`${this.APIEndpoint}/${path}`, callOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json().then((content) => {
                        return content;
                    })
                } else {
                    return response.json().then((content) => {
                        throw new FetchError(content.error);
                    }).catch((err) => {
                        throw new FetchError(err.message);
                    })
                }
            }).catch((err) => {
                throw new FetchError(err.message);
            });
    }
}

export default APIService;
