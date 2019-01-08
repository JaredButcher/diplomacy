import {makeAccount} from "../js/userManager.js";
import * as protocol from "../js/protocol.js";

document.getElementById("register").onclick = () => {
    let password = document.getElementById("password").value
    if(password == document.getElementById("passwordCheck").value){
        makeAccount(document.getElementById("username").value, password, document.getElementById("name").value, document.getElementById("phone").value, document.getElementById("email").value).then((user) => {
            window.location.replace("/");
        }, (error) => {
            if(error == protocol.ERROR.USERNAME_TAKEN){
                document.getElementById("errorMessage").innerText = "Username is taken"
                document.getElementById("errorMessage").hidden = false
            }else{
                document.getElementById("errorMessage").innerText = "Registration rejected"
                document.getElementById("errorMessage").hidden = false
            }
        });
    }
}
document.getElementById("passwordCheck").onchange = (evt) => {
    if(evt.target.value != document.getElementById("password").value){
        document.getElementById("errorMessage").innerText = "Passwords do not match"
        document.getElementById("errorMessage").hidden = false;
    }else{
        document.getElementById("errorMessage").hidden = true;
    }
}