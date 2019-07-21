export function getPublicIp() {
    return new Promise((resolve, reject) => {
        fetch('https://api.ipify.org?format=json')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                resolve(myJson.ip);
            }).catch(reason => reject(reason));
    });
}
