import {originUrl} from "../config";
import {getLocalId} from "./local_id";

export function getAllFiles() {
    const url = originUrl + '/api/data';
    console.debug("Requesting: (GET) ", url);

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.debug("Received http response:", request);
                returnPromise(request, resolve, reject);
            }
        }
    });
}

export function getFile(id) {
    const url = originUrl + '/api/data/' + id;
    console.debug("Requesting: (GET) ", url);

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.debug("Received http response:", request);
                returnPromise(request, resolve, reject);
            }
        }
    });
}

export function deleteFile(id) {
    const url = originUrl + '/api/data/' + id;
    console.debug("Requesting: (DELETE) ", url);

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('DELETE', url);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                console.debug("Received http response:", request);
                returnPromise(request, resolve, reject);
            }
        };

        request.send();
    });
}

export function ajaxFileUpload(files, availableForever, availableUntil) {
    if (files.length === 0) {
        console.debug("No files submitted");
        return null;
    }
    const url = originUrl + '/api/data/';
    console.debug("Requesting: (POST) ", url);

    return new Promise(async (resolve, reject) => {
        let uploadedBy = await getLocalId();

        let formData = new FormData();
        for (let i = 0; i < files.length; i++)
            formData.append('metaFile-' + i, files[i]);

        formData.append('availableForever', availableForever);
        formData.append('availableUntil', availableUntil);
        formData.append('uploadedBy', uploadedBy)
        //todo maybe add text
        //formData.append('text', text.value);

        let request = new XMLHttpRequest();

        request.onreadystatechange = function (e) {
            if (request.readyState === 4) {
                console.debug("Received http response:", request.response);
                returnPromise(request, resolve, reject, true);
            }
        };

        request.responseType = "json";

        request.open("POST", url);
        request.send(formData);
    });
}

function returnPromise(request, resolve, reject, skipParse) {
    if (request.status >= 200 && request.status < 300 || request.status === 304) {
        let response = skipParse ? request.response : JSON.parse(request.responseText);
        if (response.success) {
            resolve(response);
        } else {
            reject(response)
        }
    } else {
        try {
            let response = request.response;
            reject(response);
        } catch (e) {
            reject(request);
        }
    }
}

export function getTextFromUrl(url){
    // read text from URL location
    return new Promise((resolve, reject) => {
        console.debug("Requesting: (GET) ", url);
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let type = request.getResponseHeader('Content-Type');
                if (type.indexOf("text") !== 1 && (request.status >= 200 && request.status < 300 || request.status === 304)) {
                    resolve( request.responseText);
                } else {
                    try {
                        let response = request.response;
                        reject(response);
                    } catch (e) {
                        reject(request);
                    }
                }
            }
        }
    });
}
