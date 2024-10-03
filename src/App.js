import React from "react";
import {Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
//W
import Home from "./views/client-portal/Home";
import Layout from "./views/client-portal/Layout";
import Login from "./views/guest-portal/Auth/Login";
import Register from "./views/guest-portal/Auth/Register";
import {
    AdminProtectedRoute,
    ProtectedRoute,
    WithAdminAuthRoute,
    WithAuthRoute,
    WithoutAdminAuthRoute,
    WithoutAuthRoute
} from "./routes";
import EnvelopeCreate from "./views/client-portal/Envelope/create";
import Recipients from "./views/client-portal/Recipients";
import Settings from "./views/client-portal/Settings";
import Manage from "./views/client-portal/Envelope/Manage";
import CustomerPortal from "./views/customer-portal";
import GuestLayout from "./views/guest-portal/Layout";
import HomePage from "./views/guest-portal/pages/Home";
import ForgotPassword from "./views/guest-portal/Auth/ForgotPassword";
import ResetPassword from "./views/guest-portal/Auth/ResetPassword";
import Templates from "./views/client-portal/Envelope/Templates";
import ModifyTemplate from "./views/client-portal/Envelope/Templates/Modify";
import ViewEnvelope from "./views/client-portal/Envelope/Manage/ViewEnvelope";
import AboutUs from "./views/guest-portal/pages/AboutUs";
import Product from "./views/guest-portal/pages/Product";
import UseCases from "./views/guest-portal/pages/UseCases";
import Pricing from "./views/guest-portal/pages/Pricing";
import Faq from "./views/guest-portal/pages/Faq";
import Contact from "./views/guest-portal/pages/Contact";
import Careers from "./views/guest-portal/pages/Careers";
import CareersForm from "./views/guest-portal/pages/CareersForm";
import Integration from "./views/guest-portal/pages/Integration";
import Documentation from "./views/guest-portal/pages/Documentation";
import TermsConditions from "./views/guest-portal/pages/TermsConditions";
import PrivacyPolicy from "./views/guest-portal/pages/PrivacyPolicy";
import PageNotFound from "./views/PageNotFound";
import Billing from "./views/client-portal/Billing";
import BillingHistory from "./views/client-portal/Billing/BillingHistory";
import CreditHistory from "./views/client-portal/Billing/CreditHistory";
import PricingPlan from "./views/client-portal/Billing/PricingPlan";
import BillingOverview from "./views/client-portal/Billing/BillingOverview";
import SettingIntegration from "./views/client-portal/Settings/Integration";
import SettingPreferences from "./views/client-portal/Settings/Preferences";
import SettingUsers from "./views/client-portal/Settings/Users";
import SettingAccount from "./views/client-portal/Settings/Account";
import AdminPortal from "./views/admin-portal";
import AdminPortalUsers from "./views/admin-portal/Users";
import AdminPortalSubscribers from "./views/admin-portal/Subscribers";
import AdminPortalPlans from "./views/admin-portal/Plans";
import AdminPortalLogin from "./views/admin-portal/Login";
import AddRecipientEnvelope from "./views/client-portal/Envelope/Manage/ViewEnvelope/AddRecipientEnvelope";
import CustomerViewPortal from "./views/client-portal/Envelope/CustomerViewPortal";
import SettingUserGroup from "./views/client-portal/Settings/Users/UserGroupList";
import DraftManageEnvelope from "./views/client-portal/Envelope/Manage/DraftManageEnvelope";
import CompletedManageEnvelope from "./views/client-portal/Envelope/Manage/CompletedManageEnvelope";
import AdminClientPortal from "./views/admin-portal/client-portal";
import AdminClientPortalHome from "./views/admin-portal/client-portal/AdminClientPortalHome";
import AdminClientEnvelopeCreate from "./views/admin-portal/client-portal/Envelope/create";
import AdminManageEnvelope from "./views/admin-portal/client-portal/Envelope/Manage";
import AdminDraftManageEnvelope from "./views/admin-portal/client-portal/Envelope/Manage/AdminDraftManageEnvelope";
import AdminCompletedManageEnvelope
    from "./views/admin-portal/client-portal/Envelope/Manage/AdminCompletedManageEnvelope";
import AdminViewEnvelope from "./views/admin-portal/client-portal/Envelope/Manage/AdminViewEnvelope";
import AdminAddRecipientEnvelope
    from "./views/admin-portal/client-portal/Envelope/Manage/AdminViewEnvelope/AdminAddRecipientEnvelope";
import AdminRecipients from "./views/admin-portal/client-portal/AdminRecipients";
import AdminTemplates from "./views/admin-portal/client-portal/Envelope/AdminTemplates";
import AdminModifyTemplate from "./views/admin-portal/client-portal/Envelope/AdminTemplates/AdminModifyTemplate";
import AdminClientSettings from "./views/admin-portal/client-portal/Settings";
import AdminSettingAccount from "./views/admin-portal/client-portal/Settings/Account";
import AdminClientSettingUsers from "./views/admin-portal/client-portal/Settings/Users";
import AdminClientSettingUserGroup from "./views/admin-portal/client-portal/Settings/Users/AdminClientSettingUserGroup";
import AdminClientSettingPreferences from "./views/admin-portal/client-portal/Settings/Preferences";
import AdminClientSettingIntegration from "./views/admin-portal/client-portal/Settings/Integration";
import AdminClientBilling from "./views/admin-portal/client-portal/Billing";
import AdminClientBillingOverview from "./views/admin-portal/client-portal/Billing/AdminClientBillingOverview";
import AdminClientBillingHistory from "./views/admin-portal/client-portal/Billing/AdminClientBillingHistory";
import AdminClientCreditHistory from "./views/admin-portal/client-portal/Billing/AdminClientCreditHistory";
import AdminClientPricingPlan from "./views/admin-portal/client-portal/Billing/AdminClientPricingPlan";
import OneDriveIntegration from "./views/client-portal/Settings/Integration/OneDriveIntegration";
import AdminOneDriveIntegration from "./views/admin-portal/client-portal/Settings/Integration/OneDriveIntegration";
import CustomerPortalSms from "./views/customer-portal/CustomerPortalSms";
import ViewTemplateShare from "./views/client-portal/Envelope/Templates/View";
import AdminViewTemplateShare from "./views/admin-portal/client-portal/Envelope/AdminTemplates/View";
import GoogleDrive from "./views/client-portal/Settings/Integration/GoogleDrive";
import AdminGoogleDrive from "./views/admin-portal/client-portal/Settings/Integration/AdminGoogleDrive";
import DropBoxCloud from "./views/client-portal/Settings/Integration/DropBox";
import AdminDropBoxCloud from "./views/admin-portal/client-portal/Settings/Integration/AdminDropBox";
import AdminBlog from "./views/admin-portal/Blogs";
import AdminModifyBlog from "./views/admin-portal/Blogs/Modify";
import BoxCloud from "./views/client-portal/Settings/Integration/BoxCloud";
import AdminBoxCloud from "./views/admin-portal/client-portal/Settings/Integration/AdminBoxCloud";
import CustomerPortalStopReminder from "./views/customer-portal/StopReminder";
import Admin2FA from "./views/admin-portal/2FA";
import ExpiredDocument from "./views/client-portal/Envelope/Manage/ViewEnvelope/ExpiredDocument";
import AdminExpiredDocument
    from "./views/admin-portal/client-portal/Envelope/Manage/AdminViewEnvelope/AdminExpiredDocument";
import CustomerDocumentExpired from "./views/customer-portal/CustomerDocumentExpired";

function App() {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick
                            rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
            <Routes>
                <Route path="/" element={<WithoutAuthRoute/>}>
                    <Route path="/" element={<GuestLayout/>}>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/about-us" element={<AboutUs/>}/>
                        <Route path="/product" element={<Product/>}/>
                        <Route path="/use-cases" element={<UseCases/>}/>
                        <Route path="/pricing" element={<Pricing/>}/>
                        <Route path="/faq" element={<Faq/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/careers" element={<Careers/>}/>
                        <Route path="/careers/form" element={<CareersForm/>}/>
                        <Route path="/integration" element={<Integration/>}/>
                        <Route path="/documentation" element={<Documentation/>}/>
                        <Route path="/terms-condition" element={<TermsConditions/>}/>
                        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/sign-up" element={<Register/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password/:token" element={<ResetPassword/>}/>

                        <Route path="/*" element={<PageNotFound/>}/>
                    </Route>
                </Route>

                <Route path="/customer-portal/:id" element={<CustomerPortal/>}/>
                <Route path="/customer-portal/stop-reminder/:uuid/:id" element={<CustomerPortalStopReminder/>}/>
                <Route path="/client-portal/envelope/view/:id" element={<CustomerViewPortal/>}/>
                <Route path="/customer/document/:uuid/e/:id" element={<CustomerDocumentExpired/>}/>
              
               


                <Route path="/" element={<WithAuthRoute/>}>
                    <Route path="/" element={<Layout/>}>
                        <Route path="/client-portal" element={<Home/>}/>
                        <Route path="/client-portal/envelope" element={<EnvelopeCreate/>}/>
                        <Route path="/client-portal/envelope/edit/:uuid/:id" element={<EnvelopeCreate/>}/>
                        <Route path="/client-portal/envelope/edit/:uuid/:id/:direct" element={<EnvelopeCreate/>}/>
                        <Route path="/recipients" element={<Recipients/>}/>
                        <Route path="/templates" element={<Templates/>}/>
                        <Route path="/templates/create">
                            <Route index element={<ModifyTemplate type={1}/>}/>
                            <Route path=":id" element={<ModifyTemplate type={1}/>}/>
                        </Route>
                        <Route path="/templates/:id/edit" element={<ModifyTemplate type={2}/>}/>
                        <Route path="/templates/:id/view" element={<ViewTemplateShare/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/settings" element={<Settings/>}>
                            <Route path="/settings" element={<SettingAccount/>}/>
                            <Route path="/settings" element={<ProtectedRoute/>}>
                                <Route path="/settings/users" element={<SettingUsers/>}/>
                                <Route path="/settings/users/group" element={<SettingUserGroup/>}/>
                                <Route path="/settings/preferences" element={<SettingPreferences/>}/>
                                <Route path="/settings/integration" element={<SettingIntegration/>}/>
                                <Route path="/settings/integration/one-drive" element={<OneDriveIntegration/>}/>
                            </Route>
                            <Route path="/settings/integration/google-drive-success"
                                   element={<GoogleDrive type={1}/>}/>
                            <Route path="/settings/integration/google-drive-error"
                                   element={<GoogleDrive type={2}/>}/>
                            <Route path="/settings/integration/drop-box-success"
                                   element={<DropBoxCloud type={1}/>}/>
                            <Route path="/settings/integration/drop-box-error"
                                   element={<DropBoxCloud type={2}/>}/>
                            <Route path="/settings/integration/box-success"
                                   element={<BoxCloud type={1}/>}/>
                            <Route path="/settings/integration/box-error"
                                   element={<BoxCloud type={2}/>}/>
                        </Route>
                        <Route path="/manage" element={<Manage/>}/>
                        <Route path="/manage/draft" element={<DraftManageEnvelope/>}/>
                        <Route path="/manage/completed" element={<CompletedManageEnvelope/>}/>
                        <Route path="/manage/:id" element={<ViewEnvelope tabType={``}/>}/>
                        <Route path="/manage/:id/awaiting" element={<ViewEnvelope tabType={"1"}/>}/>
                        <Route path="/manage/:id/needs-review" element={<ViewEnvelope tabType={"2"}/>}/>
                        <Route path="/manage/:id/approved" element={<ViewEnvelope tabType={"3"}/>}/>
                        <Route path="/manage/:id/message" element={<ViewEnvelope tabType={"message"}/>}/>
                        <Route path="/manage/:id/recipient" element={<AddRecipientEnvelope/>}/>
                        <Route path="/manage/:id/expired-document" element={<ExpiredDocument/>}/>

                        <Route path="/" element={<ProtectedRoute/>}>
                            <Route path="/billing" element={<Billing/>}>
                                <Route path="/billing" element={<BillingOverview/>}/>
                                <Route path="/billing/history" element={<BillingHistory/>}/>
                                <Route path="/billing/credit-history" element={<CreditHistory/>}/>
                                <Route path="/billing/pricing" element={<PricingPlan/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>

                <Route path="/back-admin" element={<WithAdminAuthRoute/>}>
                    <Route path="/back-admin" element={<AdminPortal/>}>
                        <Route index element={<AdminPortalUsers/>}/>
                        <Route path="/back-admin/subscribers" element={<AdminPortalSubscribers/>}/>
                        <Route path="/back-admin/2fa" element={<Admin2FA/>}/>
                        <Route path="/back-admin/plans" element={<AdminPortalPlans/>}/>
                        <Route path="/back-admin/blogs" element={<AdminBlog/>}/>
                        <Route path="/back-admin/blogs/create" element={<AdminModifyBlog/>}/>
                        <Route path="/back-admin/blogs/:id/edit" element={<AdminModifyBlog/>}/>
                    </Route>

                    <Route path="/back-admin/client-portal/:client" element={<AdminClientPortal/>}>
                        <Route index element={<AdminClientPortalHome/>}/>
                        <Route path="/back-admin/client-portal/:client/envelope"
                               element={<AdminClientEnvelopeCreate/>}/>
                        <Route path="/back-admin/client-portal/:client/envelope/edit/:uuid/:id"
                               element={<AdminClientEnvelopeCreate/>}/>
                        <Route path="/back-admin/client-portal/:client/envelope/edit/:uuid/:id/:direct"
                               element={<AdminClientEnvelopeCreate/>}/>
                        <Route path="/back-admin/client-portal/:client/manage" element={<AdminManageEnvelope/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/draft"
                               element={<AdminDraftManageEnvelope/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/completed"
                               element={<AdminCompletedManageEnvelope/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id"
                               element={<AdminViewEnvelope tabType={``}/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/awaiting"
                               element={<AdminViewEnvelope tabType={"1"}/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/needs-review"
                               element={<AdminViewEnvelope tabType={"2"}/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/approved"
                               element={<AdminViewEnvelope tabType={"3"}/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/message"
                               element={<AdminViewEnvelope tabType={"message"}/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/recipient"
                               element={<AdminAddRecipientEnvelope/>}/>
                        <Route path="/back-admin/client-portal/:client/manage/:id/expired-document"
                               element={<AdminExpiredDocument/>}/>

                        <Route path="/back-admin/client-portal/:client/recipients" element={<AdminRecipients/>}/>
                        <Route path="/back-admin/client-portal/:client/templates" element={<AdminTemplates/>}/>
                        <Route path="/back-admin/client-portal/:client/templates/create">
                            <Route index element={<AdminModifyTemplate type={1}/>}/>
                            <Route path=":id" element={<AdminModifyTemplate type={1}/>}/>
                        </Route>
                        <Route path="/back-admin/client-portal/:client/templates/:id/edit"
                               element={<AdminModifyTemplate type={2}/>}/>
                        <Route path="/back-admin/client-portal/:client/templates/:id/view"
                               element={<AdminViewTemplateShare/>}/>

                        <Route path="/back-admin/client-portal/:client/settings" element={<AdminClientSettings/>}>
                            <Route path="/back-admin/client-portal/:client/settings" element={<AdminSettingAccount/>}/>
                            <Route path="/back-admin/client-portal/:client/settings" element={<AdminProtectedRoute/>}>
                                <Route path="/back-admin/client-portal/:client/settings/users"
                                       element={<AdminClientSettingUsers/>}/>
                                <Route path="/back-admin/client-portal/:client/settings/users/group"
                                       element={<AdminClientSettingUserGroup/>}/>
                                <Route path="/back-admin/client-portal/:client/settings/preferences"
                                       element={<AdminClientSettingPreferences/>}/>
                                <Route path="/back-admin/client-portal/:client/settings/integration"
                                       element={<AdminClientSettingIntegration/>}/>
                            </Route>
                            <Route path="/back-admin/client-portal/:client/settings/integration/google-drive-success"
                                   element={<AdminGoogleDrive type={1}/>}/>
                            <Route path="/back-admin/client-portal/:client/settings/integration/google-drive-error"
                                   element={<AdminGoogleDrive type={2}/>}/>
                            <Route path="/back-admin/client-portal/:client/settings/integration/drop-box-success"
                                   element={<AdminDropBoxCloud type={1}/>}/>
                            <Route path="/back-admin/client-portal/:client/settings/integration/drop-box-error"
                                   element={<AdminDropBoxCloud type={2}/>}/>
                            <Route path="/back-admin/client-portal/:client/settings/integration/box-success"
                                   element={<AdminBoxCloud type={1}/>}/>
                            <Route path="/back-admin/client-portal/:client/settings/integration/box-error"
                                   element={<AdminBoxCloud type={2}/>}/>
                        </Route>

                        <Route path="/back-admin/client-portal/:client/billing" element={<AdminProtectedRoute/>}>
                            <Route path="/back-admin/client-portal/:client/billing" element={<AdminClientBilling/>}>
                                <Route index element={<AdminClientBillingOverview/>}/>
                                <Route path="/back-admin/client-portal/:client/billing/history"
                                       element={<AdminClientBillingHistory/>}/>
                                <Route path="/back-admin/client-portal/:client/billing/credit-history"
                                       element={<AdminClientCreditHistory/>}/>
                                <Route path="/back-admin/client-portal/:client/billing/pricing"
                                       element={<AdminClientPricingPlan/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/back-admin/client-portal/settings/integration/one-drive"
                       element={<AdminOneDriveIntegration/>}/>

                <Route path="/back-admin/login" element={<WithoutAdminAuthRoute/>}>
                    <Route index element={<AdminPortalLogin/>}/>
                </Route>

                <Route path="/:id" element={<CustomerPortalSms/>}/>

            </Routes>
        </>
    );
}

export default App;
