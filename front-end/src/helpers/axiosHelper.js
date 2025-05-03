import axios from "axios";
import { POST_LOGIN } from "./urlHelper";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501"
const token = () => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) return JSON.parse(authUser).accessToken;
    return null;
};
const axiosApi = axios.create({
    baseURL: API_URL,
})

axiosApi.defaults.headers.common["Authorization"] = token();
axiosApi.interceptors.response.use(
    response => {
        return response
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 403 && error.config.url !== POST_LOGIN) {
                localStorage.clear();
                return window.location = '/login';
            }
        }
        return Promise.reject(error);
    }
)
export async function get(url, config = {}) {
    return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
    return axiosApi
        .post(url, { ...data }, { ...config })
        .then(response => response.data)
}

export async function put(url, data, config = {}) {
    return axiosApi
        .put(url, { ...data }, { ...config })
        .then(response => response.data)
}

export async function del(url, config = {}) {
    return await axiosApi
        .delete(url, { ...config })
        .then(response => response.data)
}
export default axiosApi;
export const setRequestInterceptor = (axios) => {
    axios.interceptors.request.use(
        (config) => {
            const _token = token();
            if (_token) {
                config.headers.Authorization = 'Bearer ' + token()
            }
            return config
        }
    )
}