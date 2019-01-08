import {login} from "./userManager.js";
import {setCookie} from "./cookies.js";
import * as protocol from "./protocol.js";

let REMEMBER_MAX_AGE = 30;

document.getElementById("login").onclick = () => {
    login(document.getElementById("username").value, document.getElementById("password").value, document.getElementById("stayLoggedIn").checked).then((user) => {
        if(user[protocol.USER.SAVEDLOGIN]){
            setCookie("remember", user[protocol.USER.SAVEDLOGIN], REMEMBER_MAX_AGE);
        }
        window.location.replace("/");
    }, () => {
        document.getElementById("errorMessage").hidden = false;
    });
}