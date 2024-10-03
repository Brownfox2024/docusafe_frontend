import axiosInstance from "./AxiosInstance";

export function getUserList(data) {
    return axiosInstance.post(`users-list`, data);
}

export function modifyUserPost(data) {
    return axiosInstance.post(`users-modify`, data);
}

export function getGroupList(data) {
    return axiosInstance.post(`group-list`, data);
}

export function modifyGroupPost(data) {
    return axiosInstance.post(`group-modify`, data);
}

export function destroyUserPost(data) {
    return axiosInstance.post(`user-delete`, data);
}

export function destroyGroupPost(data) {
    return axiosInstance.post(`group-delete`, data);
}