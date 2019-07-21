
export let getLocalId = () => {
    let localId = localStorage.getItem("localId")
    if(!localId) {
        localId = makeId(24);
        localStorage.setItem("localId", localId);
    }
    return localId
};

function makeId(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
