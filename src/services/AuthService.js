import axiosInstance from "./AxiosInstance";

export function login(postData) {
    return axiosInstance.post(`login`, postData);
}

export function register(postData) {
    return axiosInstance.post(`register`, postData);
}

export function registerWithPlan(data) {
    return axiosInstance.post(`register-plan`, data);
}

export function resendEmailCode(postData) {
    return axiosInstance.post(`resend-email-code`, postData);
}

export function forgotPassword(data) {
    return axiosInstance.post(`forgot-password`, data);
}

export function checkResetToken(data) {
    return axiosInstance.post(`check-reset-token`, data);
}

export function resetPassword(data) {
    return axiosInstance.post(`reset-password`, data);
}

export function registerWithPromoCode(data) {
    return axiosInstance.post(`register-plan-promo`, data);
}

export function loginVerifyCode(data) {
    let config = {
        headers: {
            "login_id": data.id,
            "company_login_id": data.company_login_id
        }
    };
    return axiosInstance.post(`verify-code`, data, config);
}