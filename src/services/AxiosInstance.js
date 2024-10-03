import axios from 'axios';
import Utils from "../utils";
import {API_URL} from "../configs/AppConfig";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const auth = Utils.loginUserData();
    if (Object.keys(auth).length > 0) {
        config.headers.login_id = auth.id;
        config.headers.company_login_id = (auth.role_id > 2) ? auth.company_user_id : auth.id;
        config.headers.authorization = auth.access_token
    }

    return config;
});

export default axiosInstance;