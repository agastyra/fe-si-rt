import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (accessToken) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;

        if (status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                console.error('No refresh token available');
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((accessToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post('http://127.0.0.1:8000/api/auth/refresh-token', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const newAccessToken = data.accessToken;

                localStorage.setItem('accessToken', newAccessToken);
                apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;

                onTokenRefreshed(newAccessToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const fetchRumah = async (params = null) => {
    return apiClient.get('/rumah', {
        signal: AbortController.signal,
        params
    })
}

export const postRumah = async (data) => {
    return apiClient.post('/rumah', data, {
        signal: AbortController.signal,
    })
}

export const putRumah = async (id, data) => {
    return apiClient.put(`/rumah/${id}`, data, {
        signal: AbortController.signal,
    })
}

export const deleteRumah = async (id) => {
    return apiClient.delete(`/rumah/${id}`, {
        signal: AbortController.signal
    })
}

export const fetchPenghuni = async () => {
    return apiClient.get('/penghuni', {
        signal: AbortController.signal
    })
}

export const postPenghuni = async (data) => {
    return apiClient.post('/penghuni', data, {
        signal: AbortController.signal,
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const putPenghuni = async (id, data) => {
    return apiClient.post(`/penghuni/${id}`, data, {
        signal: AbortController.signal,
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const deletePenghuni = async (id) => {
    return apiClient.delete(`/penghuni/${id}`, {
        signal: AbortController.signal
    })
}

export const fetchTipeTransaksi = async (params = null) => {
    return apiClient.get('/tipe-transaksi', {
        signal: AbortController.signal,
        params
    })
}

export const postTipeTransaksi = async (data) => {
    return apiClient.post('/tipe-transaksi', data, {
        signal: AbortController.signal
    })
}

export const putTipeTransaksi = async (id, data) => {
    return apiClient.put(`/tipe-transaksi/${id}`, data, {
        signal: AbortController.signal
    })
}

export const deleteTipeTransaksi = async (id) => {
    return apiClient.delete(`/tipe-transaksi/${id}`, {
        signal: AbortController.signal
    })
}

export const fetchTransaksi = async (params) => {
    return apiClient.get("/transaksi", {
        signal: AbortController.signal,
        params
    })
}

export const postTransaksi = async (data) => {
    return apiClient.post("/transaksi", data, {
        signal: AbortController.signal
    })
}

export const putTransaksi = async (id, data) => {
    return apiClient.put("/transaksi/" + id, data, {
        signal: AbortController.signal
    })
}

export const deleteTransaksi = async (id) => {
    return apiClient.delete(`/transaksi/${id}`, {
        signal: AbortController.signal
    })
}

export default apiClient;