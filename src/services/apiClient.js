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
    },
    async (error) => {
        if (error.response.status === 401) {
            console.warn('Token expired, refreshing...');
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const res = await apiClient.post('/auth/refresh-token', {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });
                localStorage.setItem('accessToken', res.data.accessToken);
                error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return apiClient(error.config);
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

export const fetchTransaksi = async () => {
    return apiClient.get("/transaksi", {
        signal: AbortController.signal
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