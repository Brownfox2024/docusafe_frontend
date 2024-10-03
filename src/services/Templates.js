import axiosInstance from "./AxiosInstance";

export function getTemplateList(data) {
    return axiosInstance.post(`template/list`, data);
}

export function createTemplateFolder(data) {
    return axiosInstance.post(`template/folder/create`, data);
}

export function editTemplateFolder(data) {
    return axiosInstance.post(`template/folder/edit`, data);
}

export function deleteTemplateFolder(data) {
    return axiosInstance.post(`template/folder/delete`, data);
}

export function templateFolderList(data) {
    return axiosInstance.post(`template/folder/list`, data);
}

export function moveTemplateFolder(data) {
    return axiosInstance.post(`template/folder/move`, data);
}

export function renameEnvelopeTemplate(data) {
    return axiosInstance.post(`template/envelope/rename`, data);
}

export function deleteEnvelopeTemplate(data) {
    return axiosInstance.post(`template/envelope/delete`, data);
}

export function moveEnvelopeTemplate(data) {
    return axiosInstance.post(`template/envelope/move`, data);
}

export function templateFolderBreadcrumbs(data) {
    return axiosInstance.post(`template/folder/breadcrumbs`, data);
}

export function getTemplateEnvelope(data) {
    return axiosInstance.post(`template/envelope/detail`, data);
}

export function templateEnvelopeModify(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`template/envelope/modify`, data, config);
}

export function copyTemplateEnvelope(data) {
    return axiosInstance.post(`template/envelope/copy`, data);
}

export function templateUseForEnvelope(data) {
    return axiosInstance.post(`/use-template`, data);
}

export function getTemplateUser(data) {
    return axiosInstance.post(`template/users-list`, data);
}

export function shareTemplateFolder(data) {
    return axiosInstance.post(`template/share`, data);
}

export function removeShareTemplateFolder(data) {
    return axiosInstance.post(`template/share/remove`, data);
}