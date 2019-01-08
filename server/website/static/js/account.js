import {modifyUser, getUserInfo} from "./userManager.js";
import * as PROTOCOL from "./protocol.js";

document.getElementById("apply").onclick = () => {
    let password = document.getElementById("password").value
    if(password == document.getElementById("passwordCheck").value){
        modifyUser(document.getElementById("username").value, document.getElementById("currentPassword").value, password, 
        document.getElementById("name").value, document.getElementById("phone").value, document.getElementById("email").value).then((user) => {
        }, (error) => {
            if(error == PROTOCOL.ERROR.USERNAME_TAKEN){
                document.getElementById("errorMessage").innerText = "Username is taken"
                document.getElementById("errorMessage").hidden = false
            }else{
                document.getElementById("errorMessage").innerText = "Update rejected"
                document.getElementById("errorMessage").hidden = false
            }
        });
    }
}
document.getElementById("passwordCheck").onchange = (evt) => {
    if(evt.target.value != document.getElementById("password").value){
        document.getElementById("errorMessage").innerText = "Passwords do not match"
        document.getElementById("errorMessage").hidden = false;
        document.getElementById("apply").disabled = true;
    }else{
        document.getElementById("errorMessage").hidden = true;
        document.getElementById("apply").disabled = false;
    }
}
document.getElementById("currentPassword").onchange = (evt) => {
    document.getElementById("apply").disabled = evt.target.value == "";
}
function updateValues() {
    let user = getUserInfo();
    document.getElementById("nameHeader").innerText = `${user[PROTOCOL.USER.USERNAME]}'s account:`;
    document.getElementById("username").value = user[PROTOCOL.USER.USERNAME];
    document.getElementById("name").value = user[PROTOCOL.USER.NAME];
    document.getElementById("phone").value = user[PROTOCOL.USER.PHONE];
    document.getElementById("email").value = user[PROTOCOL.USER.EMAIL];
}
document.addEventListener("updateUser", updateValues);
updateValues()