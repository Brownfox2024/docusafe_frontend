import axios from 'axios';
import Utils from "../utils";
import {API_URL} from "../configs/AppConfig";

const adminAxiosInstance = axios.create({
    baseURL: API_URL + 'admin/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

adminAxiosInstance.interceptors.request.use((config) => {
    const auth = Utils.adminLoginUserData();
    if (Object.keys(auth).length > 0) {
        config.headers.login_id = auth.id;
    }

    return config;
});

export default adminAxiosInstance;