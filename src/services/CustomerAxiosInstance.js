import axios from 'axios';
import {API_URL} from "../configs/AppConfig";

const customerAxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

export default customerAxiosInstance;