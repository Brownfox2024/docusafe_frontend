import axios from 'axios';
import Utils from "../utils";
import {PHP_API_URL} from "../configs/AppConfig";

const phpAxoisInstance = axios.create({
    baseURL: PHP_API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

phpAxoisInstance.interceptors.request.use((config) => {
    const auth = Utils.loginUserData();
    if (Object.keys(auth).length > 0) {
        config.headers.login_id = auth.id;
        config.headers.company_login_id = (auth.role_id > 2) ? auth.company_user_id : auth.id;
    }

    return config;
});

export default phpAxoisInstance;