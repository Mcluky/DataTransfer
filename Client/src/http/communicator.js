import {originUrl} from "../config";

export function getAllFiles() {
    const url = originUrl + '/api/data';
    console.debug("Requesting: (GET) ", url);

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.onreadystatechange  = function (){
            if (request.readyState === 4) {
                let response = JSON.parse(request.responseText);
                console.debug("Received http response:", response);
                if (request.status >= 200 && request.status < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }
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

        request.onreadystatechange  = function (){
            if (request.readyState === 4) {
                let response = JSON.parse(request.responseText);
                console.debug("Received http response:", response);
                if (request.status >= 200 && request.status < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }
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

        request.onreadystatechange  = function (){
            if (request.readyState === 4) {
                let response = JSON.parse(request.responseText);
                console.debug("Received http response:", response);
                if (request.status >= 200 && request.status < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }
        };

        request.send();
    });
}

export function ajaxFileUpload(files, availableForever, availableUntil) {
    if(files.length === 0) {
        console.debug("No files submitted");
        return null;
    }
    const url = originUrl + '/api/data/';
    console.debug("Requesting: (POST) ", url);

    return new Promise((resolve, reject) => {

        let formData = new FormData();
        for (let i = 0; i < files.length; i++)
            formData.append('metaFile-' + i, files[i]);

        formData.append('availableForever', availableForever);
        formData.append('availableUntil', availableUntil);
        //todo maybe add text
        //formData.append('text', text.value);

        let request = new XMLHttpRequest();
        //todo can be removed
        request.onprogress = function (e) {
            console.debug("in progress")
        };

        request.onload = function (e) {
            console.debug("on load")
        };

        request.onerror = function (e) {
            console.debug("on error")
        };

        request.upload.onprogress = function (e) {
            console.debug("upload in progress")
        };

        request.onreadystatechange = function (e) {
            if (request.readyState === 4) {
                console.debug("Received http response:", request.response);
                let response = request.response;
                if (request.status >= 200 && request.status < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }
        };

        request.responseType = "json";

        request.open("POST", url);
        request.send(formData);
    });
}
