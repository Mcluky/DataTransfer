export function copyStringToClipboard (str) {
    //from https://techoverflow.net/2019/05/03/string-in-die-zwischenablage-kopieren-mit-javascript-ohne-bibliotheken/?lang=de
    // Temporäres Element erzeugen
    let el = document.createElement('textarea');
    // Den zu kopierenden String dem Element zuweisen
    el.value = str;
    // Element nicht editierbar setzen und aus dem Fenster schieben
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Text innerhalb des Elements auswählen
    el.select();
    // Ausgewählten Text in die Zwischenablage kopieren
    document.execCommand('copy');
    // Temporäres Element löschen
    document.body.removeChild(el);
}
