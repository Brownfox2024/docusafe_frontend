import adminAxiosInstance from "./AdminAxoisInstance";

export function login(postData) {
    return adminAxiosInstance.post(`login`, postData);
}

export function getFrontUserList(data) {
    return adminAxiosInstance.post(`users`, data);
}

export function destroyUser(data) {
    return adminAxiosInstance.post(`users/delete`, data);
}

export function getSubscriberList(data) {
    return adminAxiosInstance.post(`subscribers`, data);
}

export function destroySubscriber(data) {
    return adminAxiosInstance.post(`subscribers/delete`, data);
}

export function getClientDetail(data) {
    return adminAxiosInstance.post(`get-user-detail`, data);
}

export function adminEnvelopeLeft(data) {
    return adminAxiosInstance.post(`envelope/left`, data);
}

export function adminGetMessageAlert(data) {
    return adminAxiosInstance.post(`message-alert`, data);
}

export function adminReadMessageAlert(data) {
    return adminAxiosInstance.post(`message-read`, data);
}

export function adminGetNotificationAlert(data) {
    return adminAxiosInstance.post(`notification-alert`, data);
}

export function adminReadNotificationAlert(data) {
    return adminAxiosInstance.post(`notification-read`, data);
}

export function adminGetTemplateList(data) {
    return adminAxiosInstance.post(`template/list`, data);
}

export function adminTemplateUseForEnvelope(data) {
    return adminAxiosInstance.post(`use-template`, data);
}

export function adminGetEnvelopeSenderList(data) {
    return adminAxiosInstance.post(`envelope/sender-list`, data);
}

export function adminGetEnvelopeDetail(data) {
    return adminAxiosInstance.post(`envelope/detail`, data);
}

export function adminGetPreferenceData(data) {
    return adminAxiosInstance.post(`preferences`, data);
}

export function adminCreateEnvelope(data) {
    return adminAxiosInstance.post(`envelope/create`, data);
}

export function adminUpdateEnvelope(data) {
    return adminAxiosInstance.post(`envelope/update`, data);
}

export function adminSearchEnvelopeRecipient(data) {
    return adminAxiosInstance.post(`envelope/recipient/search`, data);
}

export function adminUpdateEnvelopeRecipientStep(data) {
    return adminAxiosInstance.post(`envelope/email-detail/update`, data);
}

export function adminCreateEnvelopeRecipient(data) {
    return adminAxiosInstance.post(`envelope/recipient/create`, data);
}

export function adminUpdateRecipient(data) {
    return adminAxiosInstance.post(`recipient/edit`, data);
}

export function adminModifyDocumentRequestFormOrders(data) {
    return adminAxiosInstance.post(`envelope/set-document-request-form`, data);
}

export function adminGetEnvelopeRequestFormDetail(data) {
    return adminAxiosInstance.post(`envelope/request-form-detail`, data);
}

export function adminGetEnvelopeRequestInformationDetail(data) {
    return adminAxiosInstance.post(`envelope/request-information-detail`, data);
}

export function adminGetEnvelopeRequestSignDocumentPages(data) {
    return adminAxiosInstance.post(`envelope/sign-document-pages`, data);
}


export function adminRemoveEnvelopeRequestForm(data) {
    return adminAxiosInstance.post(`envelope/request-form-delete`, data);
}

export function adminRemoveEnvelopeSignDocument(data) {
    return adminAxiosInstance.post(`envelope/sign-document-delete`, data);
}

export function adminGetEnvelopeDocumentDetail(data) {
    return adminAxiosInstance.post(`document-detail`, data);
}

export function adminRemoveEnvelopeDocument(data) {
    return adminAxiosInstance.post(`document-delete`, data);
}

export function adminModifyEnvelopeDocument(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`envelope/documents?client_id=` + client, data, config);
}

export function adminModifyEnvelopeSignDocument(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`envelope/sign-documents?client_id=` + client, data, config);
}

export function adminSignPlaceholdersUpdate(data) {
    return adminAxiosInstance.post(`envelope/sign-placeholders-update`, data);
}



export function adminModifyEnvelopeRequestForm(data) {
    return adminAxiosInstance.post(`envelope/request-form`, data);
}

export function adminModifyEnvelopeRequestInformation(data) {
    return adminAxiosInstance.post(`envelope/request-information`, data);
}

export function adminTemplateFolderList(data) {
    return adminAxiosInstance.post(`template/folder/list`, data);
}

export function adminAddTemplate(data) {
    return adminAxiosInstance.post(`envelope/add-template`, data);
}

export function adminEnvelopeFinish(data) {
    return adminAxiosInstance.post(`envelope/finish`, data);
}

export function adminCheckEnvelopeCredit(data) {
    return adminAxiosInstance.post(`check-envelope-credit`, data);
}

export function adminDeleteManageEnvelope(data) {
    return adminAxiosInstance.post(`envelope/delete`, data);
}

export function adminCopyManageEnvelope(data) {
    return adminAxiosInstance.post(`envelope/copy`, data);
}

export function adminGetManageEnvelopeList(data) {
    return adminAxiosInstance.post(`envelope/list`, data);
}

export function adminEnvelopeDownloadAllFile(data) {
    return adminAxiosInstance.post(`envelope/download-all-files`, data);
}

export function adminManageEnvelopeSetting(data) {
    return adminAxiosInstance.post(`envelope/manage/setting`, data);
}

export function adminEnvelopeHistory(data) {
    return adminAxiosInstance.post(`envelope/history`, data);
}

export function adminSendCustomerMessage(data) {
    return adminAxiosInstance.post(`message-send`, data);
}

export function adminManageEnvelopeBulkMessage(data) {
    return adminAxiosInstance.post(`envelope/manage/bulk-message`, data);
}

export function adminManageEnvelopeDocumentDetail(data) {
    return adminAxiosInstance.post(`envelope/manage/doc-detail`, data);
}

export function adminManageEnvelopeSignDocumentDetail(data) {
    return adminAxiosInstance.post(`envelope/manage/sign-doc-detail`, data);
}

export function adminManageEnvelopeDocFormStatusUpdate(data) {
    return adminAxiosInstance.post(`envelope/manage/doc-form-status-update`, data);
}

export function adminUserEnvelopeDownloadData(data) {
    return adminAxiosInstance.post(`envelope/manage/download-recipient`, data);
}

export function adminUserEnvelopeSpecificDownloadData(data) {
    return adminAxiosInstance.post(`envelope/download-selected`, data);
}

export function adminDocUploadClient(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`envelope/doc-upload-view-doc?client_id=` + client, data, config);
}

export function adminManageEnvelopeFillFormDetail(data) {
    return adminAxiosInstance.post(`envelope/manage/form-detail`, data);
}

export function adminManageEnvelopeClose(data) {
    return adminAxiosInstance.post(`envelope/manage/close`, data);
}

export function adminManageEnvelopeResend(data) {
    return adminAxiosInstance.post(`envelope/manage/resend`, data);
}

export function adminViewMangeEnvelope(data) {
    return adminAxiosInstance.post(`envelope/manage`, data);
}

export function adminManageEnvelopeDocFormList(data) {
    return adminAxiosInstance.post(`envelope/manage/doc-form-list`, data);
}

export function adminEnvelopeDownloadData(data) {
    return adminAxiosInstance.post(`envelope/download-data`, data);
}

export function adminDocFormTemplateUse(data) {
    return adminAxiosInstance.post(`envelope/use-doc-form-template`, data);
}

export function adminEditRequestUpdateDocumentForm(data) {
    return adminAxiosInstance.post(`envelope/view-edit-request-document-form`, data);
}

export function adminGetEnvelopeDataInAddRecipient(data) {
    return adminAxiosInstance.post(`envelope/detail-for-add-recipient`, data);
}

export function adminAddRecipientViewEnvelope(data) {
    return adminAxiosInstance.post(`envelope/view-add-recipient`, data);
}

export function adminRecipientDelete(data) {
    return adminAxiosInstance.post(`recipient/delete`, data);
}

export function adminRecipientCreate(data) {
    return adminAxiosInstance.post(`recipient/create`, data);
}

export function adminGetRecipientList(data) {
    return adminAxiosInstance.post(`recipient/list`, data);
}

export function adminRecipientDetail(data) {
    return adminAxiosInstance.post(`recipient/detail`, data);
}

export function adminCreateTemplateFolder(data) {
    return adminAxiosInstance.post(`template/folder/create`, data);
}

export function adminEditTemplateFolder(data) {
    return adminAxiosInstance.post(`template/folder/edit`, data);
}

export function adminDeleteTemplateFolder(data) {
    return adminAxiosInstance.post(`template/folder/delete`, data);
}

export function adminMoveTemplateFolder(data) {
    return adminAxiosInstance.post(`template/folder/move`, data);
}

export function adminRenameEnvelopeTemplate(data) {
    return adminAxiosInstance.post(`template/envelope/rename`, data);
}

export function adminDeleteEnvelopeTemplate(data) {
    return adminAxiosInstance.post(`template/envelope/delete`, data);
}

export function adminMoveEnvelopeTemplate(data) {
    return adminAxiosInstance.post(`template/envelope/move`, data);
}

export function adminCopyTemplateEnvelope(data) {
    return adminAxiosInstance.post(`template/envelope/copy`, data);
}

export function adminTemplateFolderBreadcrumbs(data) {
    return adminAxiosInstance.post(`template/folder/breadcrumbs`, data);
}

export function adminGetTemplateEnvelope(data) {
    return adminAxiosInstance.post(`template/envelope/detail`, data);
}

export function adminTemplateEnvelopeModify(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`template/envelope/modify?client_id=` + client, data, config);
}

export function adminGetCompanyDetails(data) {
    return adminAxiosInstance.post(`company-detail`, data);
}

export function adminUpdateCompanyDetails(data) {
    return adminAxiosInstance.post(`modify-company`, data);
}

export function adminUpdateUserData(data) {
    return adminAxiosInstance.post(`update-user-profile`, data);
}

export function adminUpdatePreferenceData(data) {
    return adminAxiosInstance.post(`preferences-update`, data);
}

export function adminChangePassword(data) {
    return adminAxiosInstance.post(`change-password`, data);
}

export function adminGetUserList(data) {
    return adminAxiosInstance.post(`users-list`, data);
}

export function adminModifyUserPost(data) {
    return adminAxiosInstance.post(`users-modify`, data);
}

export function adminDestroyUserPost(data) {
    return adminAxiosInstance.post(`user-delete`, data);
}

export function adminGetGroupList(data) {
    return adminAxiosInstance.post(`group-list`, data);
}

export function adminModifyGroupPost(data) {
    return adminAxiosInstance.post(`group-modify`, data);
}

export function adminDestroyGroupPost(data) {
    return adminAxiosInstance.post(`group-delete`, data);
}

export function adminGetBillingPlanOverview(data) {
    return adminAxiosInstance.post(`plan-overview`, data);
}

export function adminCancelPlanAutoRenew(data) {
    return adminAxiosInstance.post(`plan-auto-renew`, data);
}

export function adminPostUpdateBillingCard(data) {
    return adminAxiosInstance.post(`update-billing-card`, data);
}

export function adminPostBillingHistory(data) {
    return adminAxiosInstance.post(`plan-history`, data);
}

export function adminPostBillingInvoice(data) {
    return adminAxiosInstance.post(`plan-invoice`, data);
}

export function adminPostCreditHistory(data) {
    return adminAxiosInstance.post(`credit-history`, data);
}

export function adminGetBillingPlanList(data) {
    return adminAxiosInstance.post(`plan-list`, data);
}

export function adminPostPurchaseBillingPlan(data) {
    return adminAxiosInstance.post(`plan-buy`, data);
}

export function adminPostSmsBuy(data) {
    return adminAxiosInstance.post(`sms-buy`, data);
}

export function adminCheckCloudIntegration(data) {
    return adminAxiosInstance.post(`check-cloud-integration`, data);
}

export function adminPostOneDriveDisconnect(data) {
    return adminAxiosInstance.post(`one-drive-disconnect`, data);
}

export function adminPostOneDriveConnect(data) {
    return adminAxiosInstance.post(`one-drive-redirect`, data);
}

export function adminDocAdditionalFieldsUpdate(data) {
    return adminAxiosInstance.post(`envelope/doc-additional-field-update`, data);
}

export function adminDataEnterUpdate(data) {
    return adminAxiosInstance.post(`envelope/data-enter-update`, data);
}

export function adminRemoveDocUploadClient(data) {
    return adminAxiosInstance.post(`envelope/remove-doc-upload`, data);
}

export function adminUploadCompanyFile(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`upload-company-image?client_id=` + client, data, config);
}

export function adminRemoveCompanyImage(data) {
    return adminAxiosInstance.post(`remove-company-image`, data);
}

export function adminUploadUserFile(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`upload-user-image?client_id=` + client, data, config);
}

export function adminRemoveUserImage(data) {
    return adminAxiosInstance.post(`remove-user-image`, data);
}

export function adminTransferEnvelopePost(data) {
    return adminAxiosInstance.post(`envelope/transfer-envelope`, data);
}

export function adminCheckTemplatePost(data) {
    return adminAxiosInstance.post(`envelope/check-template`, data);
}

export function adminGetTemplateUser(data) {
    return adminAxiosInstance.post(`template/users-list`, data);
}

export function adminShareTemplateFolder(data) {
    return adminAxiosInstance.post(`template/share`, data);
}

export function adminRemoveShareTemplateFolder(data) {
    return adminAxiosInstance.post(`template/share/remove`, data);
}

export function adminPostChangePlan(data) {
    return adminAxiosInstance.post(`change-plan`, data);
}

export function adminPostGoogleDriveConnect(data) {
    return adminAxiosInstance.post(`google-drive/connect`, data);
}

export function adminPostGoogleDriveDisConnect(data) {
    return adminAxiosInstance.post(`google-drive/disconnect`, data);
}

export function adminPostRemoveCreditCard(data) {
    return adminAxiosInstance.post(`remove-credit-card`, data);
}

export function adminPostCloudList(data) {
    return adminAxiosInstance.post(`cloud-list`, data);
}

export function adminPostGenerateQrCode(data) {
    return adminAxiosInstance.post(`generate-qr-code`, data);
}

export function adminPostVerifyQrCode(data) {
    return adminAxiosInstance.post(`verify-code`, data);
}

export function adminPostRemoveQrCode(data) {
    return adminAxiosInstance.post(`remove-authentication`, data);
}

export function adminDocumentUploadDrive(data) {
    return adminAxiosInstance.post(`envelope/send-it-cloud`, data);
}

export function adminPostDropBoxConnect(data) {
    return adminAxiosInstance.post(`drop-box/auth-url`, data);
}

export function adminPostDropBoxDisConnect(data) {
    return adminAxiosInstance.post(`drop-box/disconnect`, data);
}

export function adminGetBlogs(data) {
    return adminAxiosInstance.post(`blogs`, data);
}

export function adminModifyBlog(data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`blogs/modify`, data, config);
}

export function adminDeleteBlog(data) {
    return adminAxiosInstance.post(`blogs/delete`, data);
}

export function adminBlogDetail(data) {
    return adminAxiosInstance.post(`blogs/detail`, data);
}

export function adminPostBoxConnect(data) {
    return adminAxiosInstance.post(`box/auth-url`, data);
}

export function adminPostBoxDisConnect(data) {
    return adminAxiosInstance.post(`box/disconnect`, data);
}

export function adminGetTemplateDocumentData(data) {
    return adminAxiosInstance.post(`template/get-document-form`, data);
}

export function adminPostUseTemplateDocumentData(data) {
    return adminAxiosInstance.post(`envelope/use-document-data-template`, data);
}

export function adminInformationQuestionUpdate(client, data) {
    let config = {
        "content-type": "multipart/form-data",
    };
    return adminAxiosInstance.post(`envelope/information-question-update?client_id=` + client, data, config);
}

export function adminGetEnvelopeDocumentCheckStorage(data) {
    return adminAxiosInstance.post(`envelope/check-storage`, data);
}

export function adminCheckEnvelopeStorage(data) {
    return adminAxiosInstance.post(`envelope/update-storage`, data);
}

export function adminPost2FAGenerateQrCode(data) {
    return adminAxiosInstance.post(`generate-code`, data);
}

export function adminPost2FAVerifyQrCode(data) {
    let config = {
        headers: {
            "login_id": data.id,
        }
    };
    return adminAxiosInstance.post(`verify-qr-code`, data, config);
}

export function adminPost2FARemoveQrCode(data) {
    return adminAxiosInstance.post(`remove-2fa-authentication`, data);
}

export function adminCheckPassword(data) {
    return adminAxiosInstance.post(`check-password`, data);
}

export function adminPurchasePlanPromoCode(data) {
    return adminAxiosInstance.post(`purchase-promo-code`, data);
}

export function adminGetExpiredEnvelopeList(data) {
    return adminAxiosInstance.post(`envelope/expired-list`, data);
}

export function adminGetEnvelopeExpireDocuments(data) {
    return adminAxiosInstance.post(`envelope/expired-documents`, data);
}

export function adminSendEnvelopeExpireDocuments(data) {
    return adminAxiosInstance.post(`envelope/expired-documents/send`, data);
}