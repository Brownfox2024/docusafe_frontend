let nameConventionList = [
    {id: 1, value: `<Today's Date>_<Document Name>_<Last Name>_<First Name>`},
    {id: 2, value: `<Today's Date>_<Document Name>_<First Name>_<Last Name>`},
    {id: 3, value: `<First Name>_<Last Name>_<Today's Date>_<Document Name>`},
    {id: 4, value: `<First Name>_<Last Name>_<Document Name>_<Today's Date>`},
    {id: 5, value: `<Document Name>_<First Name>_<Last Name>_<Today's Date>`},
    {id: 6, value: `<Envelope Name>_<Document Name>_<First Name>_<Last Name>_<Today's Date>`},
    {id: 7, value: `<Reference ID>_<Document Name>_<First Name>_<Last Name>_<Today's Date>`},
    {id: 8, value: `<Document Name>_<First Name>_<Last Name>_<Today's Date>_<Reference ID>`}
];

let syncStatusList = [
    {id: 0, value: 'Disabled'}
];

let passwordList = [
    {id: 0, value: 'No'},
    {id: 1, value: 'Yes'}
];

let sendReminderList = [
    {id: 0, value: 'Do not send Reminder'},
    {id: 1, value: 'Every Day'},
    {id: 2, value: 'Every Second Day'},
    {id: 3, value: 'Every Third Day'},
    {id: 4, value: 'Every Fourth Day'},
    {id: 5, value: 'Every Fifth Day'},
    {id: 6, value: 'Every Sixth Day'},
    {id: 7, value: 'Every Week'}
];

let overDueReminderList = [
    {id: 0, value: 'Do not send Reminder'},
    {id: 1, value: 'Every Day'},
    {id: 2, value: 'Every Second Day'},
    {id: 3, value: 'Every Third Day'},
    {id: 4, value: 'Every Fourth Day'},
    {id: 5, value: 'Every Fifth Day'},
    {id: 6, value: 'Every Sixth Day'},
    {id: 7, value: 'Every Week'}
];

let smsSenderList = [
    {id: 1, value: 'Send Envelope SMS', amount: 0.22},
    {id: 2, value: 'Send Envelope SMS & Send SMS 2 Days before Due Date', amount: 0.44},
    {
        id: 3,
        value: 'Send Envelope SMS, Send SMS 2 Days before Due Date & Send Envelope fullfilment message to Sender',
        amount: 0.66
    }
];
let perSmsAmount = 0.22;

let monthList = [
    {id: 1, value: 'January'},
    {id: 2, value: 'February'},
    {id: 3, value: 'March'},
    {id: 4, value: 'April'},
    {id: 5, value: 'May'},
    {id: 6, value: 'June'},
    {id: 7, value: 'July'},
    {id: 8, value: 'August'},
    {id: 9, value: 'September'},
    {id: 10, value: 'October'},
    {id: 11, value: 'November'},
    {id: 12, value: 'December'}
];

let passwordRules = [
    {id: 1, text: "At least 8 character total", active: false},
    {id: 2, text: "At least 1 Uppercase Character", active: false},
    {id: 3, text: "At least 1 lowercase Character", active: false},
    {id: 4, text: "At least 1 Number", active: false},
    {id: 5, text: "At least 1 of these characters: ! @ # $ % ^ &", active: false},
];

let dateFormatList = [
    {id: 1, text: 'DD/MM/YYYY', format: 'dd/MM/yyyy'},
    {id: 2, text: 'MM/DD/YYYY', format: 'MM/dd/yyyy'},
    {id: 3, text: 'MM/YYYY', format: 'MM/yyyy'}
];

let industryList = [
    "Mortage Brokers",
    "Accountant & Tax Professionals",
    "Recruiters",
    "Immigration Agents",
    "Auditors",
    "Lawyers",
    "Financial Planners",
    "Real Estate Agents",
    "Educational Institutes",
    "Other"
];

let formOptions = [
    {type: 1, name: 'Short text', icon: 'short-text.png'},
    {type: 2, name: 'Long text', icon: 'long-text.png'},
    {type: 3, name: 'Dropdown', icon: 'dropdown.png'},
    {type: 4, name: 'Single Choice', icon: 'single-choice.png'},
    {type: 5, name: 'Multiple choice', icon: 'multiple-choice.png'},
    {type: 6, name: 'File Uploaded', icon: 'file-uploaded.png'},
    {type: 7, name: 'Add Content', icon: 'long-text.png'},
    {type: 8, name: 'Date', icon: 'date-calendar.png'},
];

let environment = 'local'; /*local, dev, production*/

let domainName = 'http://localhost:3000';
let apiUrl = 'http://localhost:4242/api/v1/';
let phpApiUrl = 'http://localhost/waytoweb/docutik/docutik_backend/php/';
let googleDriveType = 0;/* 0 for local, 1 for live, 2 for dev */
let isHeaderCall = false;

if (environment === 'dev') {
    domainName = 'https://test.docutick.com';
    apiUrl = 'https://backend.docutick.com:39001/api/v1/';
    phpApiUrl = 'https://test.docutick.com/node/php/';
    googleDriveType = 2;
    isHeaderCall = true;
}
if (environment === 'production') {
    domainName = 'https://www.docutick.com';
    apiUrl = 'https://backend.docutick.com:5001/api/v1/';
    phpApiUrl = 'https://www.docutick.com/node/php/';
    googleDriveType = 1;
    isHeaderCall = true;
}


let oneDriveUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=c9f64bb2-3d98-4864-8c45-3c4b27d0d2a9&scope=offline_access%20files.readwrite.all&response_type=code&redirect_uri=' + domainName;

// Font Options for the dropdown
let signFontFamilyOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    // { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Futura', label: 'Futura' },
    // { value: 'Garuda', label: 'Garuda' }
];

// FontSize Options for the dropdown
let signFontSizeOptions = [
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' },
    { value: '20', label: '20' },
    { value: '22', label: '22' },
    { value: '24', label: '24' },
    { value: '26', label: '26' },
    { value: '28', label: '28' },
    { value: '30', label: '30' },
    { value: '32', label: '32' }
];

// DateFormat Options for the dropdown
let signDateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

let quillModules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link'],                                       
    ],
    clipboard: {
        matchVisual: false,
    }
};

let quillFormats = [
    'header', 'font',
    'bold', 'italic', 'underline',
    'link',
    'list', 'bullet'
];

export const DOMAIN_NAME = domainName;
export const COUNTRY_ID = 13;
export const COUNTRY_CODE = 61;
export const COUNTRY_ICON = 'au';
export const API_URL = apiUrl;
export const PHP_API_URL = phpApiUrl;
export const NAME_CONVENTION = nameConventionList;
export const SYNC_STATUS = syncStatusList;
export const SEND_REMINDER = sendReminderList;
export const OVERDUE_REMINDER = overDueReminderList;
export const PASSWORD_LIST = passwordList;
export const LOCATION_URL = 'https://geolocation-db.com/json/';
export const ADMIN_LOCAL_STORE = '@secure.d.a.data';
export const CLIENT_LOCAL_STORE = '@secure.d.f.data';
export const CUSTOMER_PORTAL = 'docutik-client';
export const SALT = 'docutik-6d090796-ecdf-11ea-adc1-0242ac112345';
export const CURRENT_YEAR = '2023';
export const EVERY_ONE_OBJECT = {value: 0, label: 'Everyone'};
export const SMS_SENDER_LIST = smsSenderList;
export const PER_SMS_AMOUNT = perSmsAmount;
export const MONTH_LIST = monthList;
export const PASSWORD_RULES = passwordRules;
export const FACEBOOK_URL = "https://www.facebook.com/DocuTik";
export const TWITTER_URL = "https://twitter.com/DocuTik";
export const INSTAGRAM_URL = "https://www.instagram.com/DOCUTIK/";
export const ONE_DRIVE_CONNECT_URL = oneDriveUrl + "/settings/integration/one-drive";
export const ONE_DRIVE_CONNECT_URL_BACKEND = oneDriveUrl + "/back-admin/client-portal/settings/integration/one-drive";
export const DATE_FORMAT_LIST = dateFormatList;
export const INDUSTRY_LIST = industryList;
export const GOOGLE_DRIVE_TYPE = googleDriveType;
export const IS_CALL = isHeaderCall;
export const FORM_OPTIONS = formOptions;
export const FONT_FAMILY_LIST = signFontFamilyOptions;
export const FONT_SIZE_LIST = signFontSizeOptions;
export const DATEFORMAT_LIST = signDateFormatOptions;
export const QUILL_MODULES = quillModules;
export const QUILL_FORMATS = quillFormats;

