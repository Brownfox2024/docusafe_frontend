import axiosInstance from "./AxiosInstance";
import phpAxoisInstance from "./PhpAxoisInstance";
import customerAxiosInstance from "./CustomerAxiosInstance";

export function getCountryList() {
    return axiosInstance.get(`country-list`);
}

export function getFaqList() {
    return axiosInstance.get(`faq-list`);
}

export function getCountryByOrder(column) {
    return axiosInstance.get(`country-list?order=` + column);
}

export function getEnvelopeSenderList() {
    return axiosInstance.post(`envelope/sender-list`);
}

export function createEnvelope(data) {
    return axiosInstance.post(`envelope/create`, data);
}

export function updateEnvelope(data) {
    return axiosInstance.post(`envelope/update`, data);
}

export function updateEnvelopeRecipientStep(data) {
    return axiosInstance.post(`envelope/email-detail/update`, data);
}

export function searchEnvelopeRecipient(data) {
    return axiosInstance.post(`envelope/recipient/search`, data);
}

export function createEnvelopeRecipient(data) {
    return axiosInstance.post(`envelope/recipient/create`, data);
}

export function updateRecipient(data) {
    return axiosInstance.post(`recipient/edit`, data);
}

export function modifyEnvelopeDocument(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`envelope/documents`, data, config);
}

export function modifyEnvelopeSignDocument(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`envelope/sign-documents`, data, config);
}

export function signPlaceholdersUpdate(data) {
    return axiosInstance.post(`envelope/sign-placeholders-update`, data);
}


export function modifyEnvelopeRequestForm(data) {
    return axiosInstance.post(`envelope/request-form`, data);
}

export function modifyEnvelopeRequestInformation(data) {
    return axiosInstance.post(`envelope/request-information`, data);
}

export function modifyDocumentRequestFormOrders(data) {
    return axiosInstance.post(`envelope/set-document-request-form`, data);
}

export function getEnvelopeDocumentDetail(data) {
    return axiosInstance.post(`document-detail`, data);
}

export function getEnvelopeDocumentCheckStorage(data) {
    return axiosInstance.post(`envelope/check-storage`, data);
}

export function removeEnvelopeDocument(data) {
    return axiosInstance.post(`document-delete`, data);
}

export function getEnvelopeRequestFormDetail(data) {
    return axiosInstance.post(`envelope/request-form-detail`, data);
}

export function getEnvelopeRequestInformationDetail(data) {
    return axiosInstance.post(`envelope/request-information-detail`, data);
}

export function getEnvelopeRequestSignDocumentPages(data) {
    return axiosInstance.post(`envelope/sign-document-pages`, data);
}



export function removeEnvelopeRequestForm(data) {
    return axiosInstance.post(`envelope/request-form-delete`, data);
}

export function removeEnvelopeSignDocument(data) {
    return axiosInstance.post(`envelope/sign-document-delete`, data);
}

export function envelopeFinish(data) {
    return axiosInstance.post(`envelope/finish`, data);
}

export function addTemplate(data) {
    return axiosInstance.post(`envelope/add-template`, data);
}

export function changePassword(data) {
    return axiosInstance.post(`change-password`, data);
}

export function updateUserData(data) {
    return axiosInstance.post(`update-user-profile`, data);
}

export function getCompanyDetails(data) {
    return axiosInstance.post(`company-detail`, data);
}

export function updateCompanyDetails(data) {
    return axiosInstance.post(`modify-company`, data);
}

export function getCustomerEnvelopeData(data) {
    return customerAxiosInstance.post(`customer-envelope/detail`, data);
}

export function getCustomerMessageList(data) {
    return axiosInstance.post(`message-list`, data);
}

export function sendCustomerMessage(data) {
    return axiosInstance.post(`message-send`, data);
}

export function recipientSendMessage(data) {
    return customerAxiosInstance.post(`message-send`, data);
}

export function uploadCustomerEnvelopeDocument(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return customerAxiosInstance.post(`customer-envelope/document-upload`, data, config);
}

export function getEnvelopeDetail(data) {
    return axiosInstance.post(`envelope/detail`, data);
}

export function getManageEnvelopeList(data) {
    return axiosInstance.post(`envelope/list`, data);
}

export function deleteManageEnvelope(data) {
    return axiosInstance.post(`envelope/delete`, data);
}

export function copyManageEnvelope(data) {
    return axiosInstance.post(`envelope/copy`, data);
}

export function uploadCustomerEnvelopeForm(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return customerAxiosInstance.post(`customer-envelope/request-form`, data, config);
}

export function sendCustomerEnvelope(data) {
    return customerAxiosInstance.post(`customer-envelope/send`, data);
}

export function updateCustomerSignOnDocument(data) {
    return axiosInstance.post(`customer-envelope/sign-document-update`, data);
}

export function getCustomerSignDocumentPages(data) {
    return axiosInstance.post(`customer-envelope/sign-document-pages`, data);
}

export function declineCustomerSignDocument(data) {
    return axiosInstance.post(`customer-envelope/sign-document-decline`, data);
}


export function viewMangeEnvelope(data) {
    return axiosInstance.post(`envelope/manage`, data);
}

export function manageEnvelopeSetting(data) {
    return axiosInstance.post(`envelope/manage/setting`, data);
}

export function manageFiles(data) {
    return axiosInstance.post(`envelope/files`,data)
}

export function manageEnvelopeBulkMessage(data) {
    return axiosInstance.post(`envelope/manage/bulk-message`, data);
}

export function manageEnvelopeDocFormList(data) {
    return axiosInstance.post(`envelope/manage/doc-form-list`, data);
}

export function manageEnvelopeDocumentDetail(data) {
    return axiosInstance.post(`envelope/manage/doc-detail`, data);
}

export function manageEnvelopeSignDocumentDetail(data) {
    return axiosInstance.post(`envelope/manage/sign-doc-detail`, data);
}

export function manageEnvelopeDocFormStatusUpdate(data) {
    return axiosInstance.post(`envelope/manage/doc-form-status-update`, data);
}

export function userEnvelopeDownloadData(data) {
    return axiosInstance.post(`envelope/manage/download-recipient`, data);
}

export function userEnvelopeSpecificDownloadData(data) {
    return axiosInstance.post(`envelope/download-selected`, data);
}

export function manageEnvelopeFillFormDetail(data) {
    return axiosInstance.post(`envelope/manage/form-detail`, data);
}

export function manageEnvelopeClose(data) {
    return axiosInstance.post(`envelope/manage/close`, data);
}

export function manageEnvelopeResend(data) {
    return axiosInstance.post(`envelope/manage/resend`, data);
}

export function getNotificationAlert(data) {
    return axiosInstance.post(`notification-alert`, data);
}

export function readNotificationAlert(data) {
    return axiosInstance.post(`notification-read`, data);
}

export function getMessageAlert(data) {
    return axiosInstance.post(`message-alert`, data);
}

export function readMessageAlert(data) {
    return axiosInstance.post(`message-read`, data);
}

export function postNewsLetter(data) {
    return axiosInstance.post(`newsletter`, data);
}

export function postContact(data) {
    alert(data.email);
    return axiosInstance.post(`contact`, data);
}

export function docFormTemplateUse(data) {
    return axiosInstance.post(`envelope/use-doc-form-template`, data);
}

export function envelopeHistory(data) {
    return axiosInstance.post(`envelope/history`, data);
}

// export function envelopeFiles(data) {
//     return axiosInstance.post(`envelope/files`, data);
// }

export function getEnvelopeDataInAddRecipient(data) {
    return axiosInstance.post(`envelope/detail-for-add-recipient`, data);
}

export function addRecipientViewEnvelope(data) {
    return axiosInstance.post(`envelope/view-add-recipient`, data);
}

export function editRequestUpdateDocumentForm(data) {
    return axiosInstance.post(`envelope/view-edit-request-document-form`, data);
}

export function envelopeDownloadData(data) {
    return axiosInstance.post(`envelope/download-data`, data);
}

export function envelopeDownloadPdfData(envelopeId, recipientId) {
    return phpAxoisInstance.post(`envelope-data.php?envelope_id=` + envelopeId + `&recipient_id=` + recipientId);
}

export function envelopeDownloadAllFile(data) {
    return axiosInstance.post(`envelope/download-all-files`, data);
}

export function envelopeCustomerViewPortal(data) {
    return axiosInstance.post(`envelope/customer-view-detail`, data);
}

export function envelopeLeft(data) {
    return axiosInstance.post(`envelope/left`, data);
}

export function getPreferenceData(data) {
    return axiosInstance.post(`preferences`, data);
}

export function updatePreferenceData(data) {
    return axiosInstance.post(`preferences-update`, data);
}

export function docUploadClient(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`envelope/doc-upload-view-doc`, data, config);
}

export function checkEnvelopeCredit(data) {
    return axiosInstance.post(`check-envelope-credit`, data);
}

export function checkEnvelopeStorage(data) {
    return axiosInstance.post(`/envelope/update-storage`, data);
}

export function postCareers(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`career-form`, data, config);
}

export function postOneDriveConnect(data) {
    return axiosInstance.post(`one-drive-redirect`, data);
}

export function checkCloudIntegration(data) {
    return axiosInstance.post(`check-cloud-integration`, data);
}

export function postOneDriveDisconnect(data) {
    return axiosInstance.post(`one-drive-disconnect`, data);
}

export function docAdditionalFieldsUpdate(data) {
    return axiosInstance.post(`envelope/doc-additional-field-update`, data);
}

export function dataEnterUpdate(data) {
    return axiosInstance.post(`envelope/data-enter-update`, data);
}

export function removeDocUploadClient(data) {
    return axiosInstance.post(`envelope/remove-doc-upload`, data);
}

export function getCustomerPortalLink(data) {
    return axiosInstance.post(`envelope/customer-portal-link`, data);
}

export function uploadCompanyFile(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`upload-company-image`, data, config);
}

export function removeCompanyImage(data) {
    return axiosInstance.post(`remove-company-image`, data);
}

export function uploadUserFile(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`upload-user-image`, data, config);
}

export function removeUserImage(data) {
    return axiosInstance.post(`remove-user-image`, data);
}

export function transferEnvelopePost(data) {
    return axiosInstance.post(`envelope/transfer-envelope`, data);
}

export function checkTemplatePost(data) {
    return axiosInstance.post(`envelope/check-template`, data);
}

export function postDownloadFile(data) {
    return axiosInstance.post(`file-download`, data);
}

export function postGoogleDriveConnect(data) {
    return axiosInstance.post(`google-drive/connect`, data);
}

export function postGoogleDriveDisConnect(data) {
    return axiosInstance.post(`google-drive/disconnect`, data);
}

export function postCloudList(data) {
    return axiosInstance.post(`cloud-list`, data);
}

export function postGenerateQrCode(data) {
    return axiosInstance.post(`generate-qr-code`, data);
}

export function postVerifyQrCode(data) {
    return axiosInstance.post(`verify-code`, data);
}

export function postRemoveQrCode(data) {
    return axiosInstance.post(`remove-authentication`, data);
}

export function documentUploadDrive(data) {
    return axiosInstance.post(`envelope/send-it-cloud`, data);
}

export function postDropBoxConnect(data) {
    return axiosInstance.post(`drop-box/auth-url`, data);
}

export function postDropBoxDisConnect(data) {
    return axiosInstance.post(`drop-box/disconnect`, data);
}

export function postBlogList(data) {
    return axiosInstance.post(`blog-list`, data);
}

export function postBlogDetail(data) {
    return axiosInstance.post(`blog-detail`, data);
}

export function envelopeVerifyOtp(data) {
    return axiosInstance.post(`customer-envelope/check-otp`, data);
}

export function postBoxConnect(data) {
    return axiosInstance.post(`box/auth-url`, data);
}

export function postBoxDisConnect(data) {
    return axiosInstance.post(`box/disconnect`, data);
}

export function getTemplateDocumentData(data) {
    return axiosInstance.post(`template/get-document-form`, data);
}

export function postUseTemplateDocumentData(data) {
    return axiosInstance.post(`envelope/use-document-data-template`, data);
}

export function informationQuestionUpdate(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return axiosInstance.post(`envelope/information-question-update`, data, config);
}

export function postCustomerEnvelopeStopReminder(data) {
    return customerAxiosInstance.post(`customer-envelope/stop-reminder`, data);
}

export function getExpiredEnvelopeList() {
    return axiosInstance.post(`envelope/expired-list`);
}

export function getEnvelopeExpireDocuments(data) {
    return axiosInstance.post(`envelope/expired-documents`, data);
}

export function sendEnvelopeExpireDocuments(data) {
    return axiosInstance.post(`envelope/expired-documents/send`, data);
}

export function getCustomerDocumentExpired(data) {
    return axiosInstance.post(`customer-envelope/documents-expired`, data);
}

export function uploadCustomerEnvelopeDocumentExpired(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return customerAxiosInstance.post(`customer-envelope/document-expired-upload`, data, config);
}