import axiosInstance from "./AxiosInstance";

export function getRecipientList(data) {
    return axiosInstance.post(`recipient/list`, data);
}

export function recipientCreate(data) {
    return axiosInstance.post(`recipient/create`, data);
}

export function recipientDetail(data) {
    return axiosInstance.post(`recipient/detail`, data);
}

export function recipientDelete(data) {
    return axiosInstance.post(`recipient/delete`, data);
}