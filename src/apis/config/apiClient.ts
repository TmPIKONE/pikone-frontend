import axios from "axios";
import { BASE_URL } from "../../constants/endPoint";

const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {

    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default apiClient;