import axiosInstance from "./AxiosInstance";
import phpAxoisInstance from "./PhpAxoisInstance";

export function getBillingPlanList(data) {
    return axiosInstance.post(`plan-list`, data);
}

export function getBillingPlanOverview(data) {
    return axiosInstance.post(`plan-overview`, data);
}

export function postPurchaseBillingPlan(data) {
    return axiosInstance.post(`plan-buy`, data);
}

export function cancelPlanAutoRenew(data) {
    return axiosInstance.post(`plan-auto-renew`, data);
}

export function postUpdateBillingCard(data) {
    return axiosInstance.post(`update-billing-card`, data);
}

export function postBillingHistory(data) {
    return axiosInstance.post(`plan-history`, data);
}

export function postCreditHistory(data) {
    return axiosInstance.post(`credit-history`, data);
}

export function postSmsBuy(data) {
    return axiosInstance.post(`sms-buy`, data);
}

export function postBillingInvoice(data) {
    return axiosInstance.post(`plan-invoice`, data);
}

export function postBillingInvoiceDownload(id) {
    return phpAxoisInstance.post(`generate-invoice.php?id=` + id);
}

export function postChangePlan(data) {
    return axiosInstance.post(`change-plan`, data);
}

export function removeCreditCard(data) {
    return axiosInstance.post(`remove-credit-card`, data);
}

export function purchasePlanPromoCode(data) {
    return axiosInstance.post(`purchase-promo-code`, data);
}