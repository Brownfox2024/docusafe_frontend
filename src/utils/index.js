import Axios from "axios";
import {ADMIN_LOCAL_STORE, CLIENT_LOCAL_STORE, LOCATION_URL, SALT} from "../configs/AppConfig";
import {decryptData, encryptData} from "./crypto";
import Moment from "moment";
import FileDownload from 'js-file-download';
import {toast} from "react-toastify";
import {postDownloadFile} from "../services/CommonService";

class Utils {
    static getErrorMessage(err) {
        let error = 'Oops...something went wrong.';
        if (err.response && err.response.data && err.response.data.message) {
            error = err.response.data.message;
        } else if (err.message) {
            error = err.message;
        }
        return error;
    }

    static loginUserData() {
        let data = localStorage.getItem(CLIENT_LOCAL_STORE);
        if (data) {
            return decryptData(data, SALT);
        } else {
            return {};
        }
    }

    static adminLoginUserData() {
        let data = localStorage.getItem(ADMIN_LOCAL_STORE);
        if (data) {
            return decryptData(data, SALT);
        } else {
            return {};
        }
    }

    static displayName() {
        let data = localStorage.getItem(CLIENT_LOCAL_STORE);
        let loginUser = decryptData(data, SALT);
        let name = '';

        if (loginUser) {
            name = loginUser.first_name.charAt(0) + loginUser.last_name.charAt(0);
        }
        return name;
    }

    static adminDisplayName() {
        let data = localStorage.getItem(ADMIN_LOCAL_STORE);
        let loginUser = decryptData(data, SALT);
        let name = '';

        if (loginUser) {
            name = loginUser.first_name.charAt(0) + loginUser.last_name.charAt(0);
        }
        return name;
    }

    static tableShowLengths() {
        return [10, 25, 50, 100];
    }

    static async getIpAddress() {
        let ipAddress = '';
        await Axios.get(LOCATION_URL)
            .then(response => {
                if (response && response.data) {
                    ipAddress = response.data.IPv4;
                }
            })
            .catch(err => {

            });

        return ipAddress;
    };



    static async getCurrentCountryCode() {
        let code = '';
        await Axios.get(LOCATION_URL)
            .then(response => {
                if (response && response.data) {
                    code = response.data.country_code.toLocaleLowerCase();
                }
            })
            .catch(err => {

            });

        return code;
    };

    static pastDate() {
        return new Date(Moment().add(1, 'days').format('YYYY-MM-DD'));
    }

    static cardYearList() {
        let currentYear = Moment().format('YYYY');
        let lastYear = parseInt(currentYear) + 20;
        let years = [];

        for (let i = currentYear; i <= lastYear; i++) {
            years.push(i);
        }

        return years;
    }

    static updateTheme(theme) {
        let data = localStorage.getItem(CLIENT_LOCAL_STORE);
        let loginUser = decryptData(data, SALT);

        if (loginUser) {
            loginUser.theme_color = theme;
            let encryptedData = encryptData(loginUser, SALT);
            localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
        }

        return true;
    }

    static ccFormat(value) {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "").substr(0, 20);
        const parts = [];

        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }

        return parts.length > 1 ? parts.join(" ") : value;
    }

    static mobileFormat(data) {
        let mobile = '';

        if (data.mobile) {
            let number = data.mobile;
            let firstLetter = number.toString().charAt(0);

            if (parseInt(firstLetter) === 0) {
                number = number.substring(1);
            }

            mobile = '+' + data.country_code + number;
        }

        return mobile;
    }

    static loginClientUserData(client) {
        let data = localStorage.getItem(client);
        if (data) {
            return decryptData(data, SALT);
        } else {
            return {};
        }
    }

    static clientUpdateTheme(client, theme) {
        let data = localStorage.getItem(client);
        let loginUser = decryptData(data, SALT);

        if (loginUser) {
            loginUser.theme_color = theme;
            let encryptedData = encryptData(loginUser, SALT);
            localStorage.setItem(client, encryptedData);
        }

        return true;
    }

    static expiryDateFormatText(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    static async downloadAnyFile(fileUrl, fileName) {
        let url = '';
        await postDownloadFile({url: fileUrl})
            .then(response => {
                url = response.data.url;
            })
            .catch(err => {
                toast.error(this.getErrorMessage(err));
            });

        if (url) {
            await Axios({
                url: url,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': '*'
                }
            }).then((res) => {
                FileDownload(res.data, fileName);
            }).catch(err => {
                toast.error('Oops...something went wrong. File not found.');
            });
        }

        return true;
    }

    static base64toBlob(base64String, contentType = 'image/png') {
        const byteCharacters = atob(base64String); // Decode base64
        const byteNumbers = new Array(byteCharacters.length);
    
        // Convert to byte numbers
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
    
        // Create a typed array from byte numbers
        const byteArray = new Uint8Array(byteNumbers);
    
        // Create a Blob
        return new Blob([byteArray], { type: contentType });
    }

    // Function to convert Data URL to Blob
    static dataURLToBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    static createBlobURL(blob) {
        return URL.createObjectURL(blob);
    }

    static getCurrentDateByFormat(dateFormat) {
        const currentDate = new Date();
    
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
    
        const formattedDate = currentDate.toLocaleDateString('en-US', options).replace(/\//g, '-');
        
        switch(dateFormat) {
            case 'YYYY-MM-DD':
                return formattedDate.substring(6, 10) + '-' + formattedDate.substring(0, 5);
            case 'DD-MM-YYYY':
                return formattedDate.substring(0, 10);
            case 'MM-DD-YYYY':
                return formattedDate.substring(3, 10) + '-' + formattedDate.substring(0, 2);
            case 'DD/MM/YYYY':
                return formattedDate.substring(0, 2) + '/' + formattedDate.substring(3, 5) + '/' + formattedDate.substring(6, 10);
            case 'YYYY/MM/DD':
                return formattedDate.substring(6, 10) + '/' + formattedDate.substring(3, 5) + '/' + formattedDate.substring(0, 2);
            case 'YYYY-MM-DD HH:mm:ss':
                return formattedDate.substring(6, 10) + '-' + formattedDate.substring(0, 5) + ' ' + currentDate.toLocaleTimeString();
            default:
                return formattedDate;
        }
    }
}


export default Utils;