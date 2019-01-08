import {establishSession, setUserInfo} from "./userManager.js";

let req = new XMLHttpRequest();
req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200 || this.status == 404){
        let content = document.getElementById("content")
        content.innerHTML = this.responseText;
        for(let script of document.getElementById("content").querySelectorAll("script")){
            let elm = document.createElement("script");
            elm.type = "module";
            elm.src = script.src;
            content.removeChild(script);
            content.appendChild(elm);
        }
        establishSession();
    }
}
if(window.location.pathname == "/") window.location.pathname = "home/index";
req.open("GET", `../static${window.location.pathname}.html`, true);
req.send();
setUserInfo();