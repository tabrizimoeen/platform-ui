import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080/api",
});

client.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,

    (error) => {

        const status = error.response?.status;

        if (status === 401) {

            localStorage.removeItem("token");

            window.location.href = "/login";
        }

        if (status === 403) {
            console.error("Access denied");
        }

        if (status === 500) {
            console.error("Server error");
        }

        return Promise.reject(error);
    }
);

export default client;