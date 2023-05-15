
let url = window.location.href
let urlEnd = url.split('/').at(-1)

if (urlEnd=="error") {
    document.getElementById("error-display").innerText = "Wrong login credentials";
}