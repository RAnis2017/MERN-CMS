export const fetchFunc = (url, method, headers, data, navigate) =>
    fetch(url, {
        method,
        headers,
        body: data
    }).then(res => {
        if (res.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            navigate('/')
        }
        return res.json()
    }
    )