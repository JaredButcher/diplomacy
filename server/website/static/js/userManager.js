/**
 * Manage login, logout, and account creation and modification
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/userManager
 */

import { WsClient, WS_PORT } from "./WsClient.js";
import * as PROTOCOL from "./protocol.js";
import { setCookie } from "./cookies.js";

let REMEMBER_MAX_AGE = 30;

/**
 * Login user
 * @param {string} username 
 * @param {string} password
 * @returns {Object} was login sucessful returns player object, unscessful return null
 */
function login(username, password){
    ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
        if(!isBlob && message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
            if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                return message[PROTOCOL.FIELD.PLAYER];
            }else{
                return null;
            }
        }
    });
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGIN;
    req[PROTOCOL.FIELD.PLAYER] = {};
    req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.USERNAME] = username;
    req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PASSWORD] = password;
    ws.send(req);
}

/**
 * Make new account
 * @param {string} username 
 * @param {string} password 
 * @param {string} [name] 
 * @param {string} [phone] 
 * @param {string} [email]
 * @returns {Object} was registration sucessful returns player object, otherwise returns the error code
 */
function makeAccount(username, password, name=null, phone=null, email=null){
    ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
        if(messagereq[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
            if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                return message[PROTOCOL.FIELD.PLAYER];
            }else{
                return message[PROTOCOL.FIELD.ERROR];
            }
        }
    });
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.REGISTER;
    req[PROTOCOL.FIELD.PLAYER] = {};
    req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.USERNAME] = username;
    req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PASSWORD] = password;
    if(name) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.NAME] = name;
    if(phone) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PHONE] = phone;
    if(email) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.EMAIL] = email;
    ws.send(req);
}

/**
 * logout the currently loged in user
 */
function logout(){
    ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT);
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGOUT;
    ws.send(req);
}


if(window.location.pathname == "/user/login"){
    document.getElementById("login").onclick = () => {
        let user = login(document.getElementById("username").value, document.getElementById("password").value, document.getElementById("stayLoggedIn").value)
        if(user){
            if(user[PROTOCOL.USER.SAVEDLOGIN]){
                setCookie("remember", user[PROTOCOL.USER.SAVEDLOGIN], REMEMBER_MAX_AGE);
            }
            window.location.replace("/");
        }else{
            document.getElementById("unscessfulMessage").hidden = false;
        }
    }
}
if(window.location.pathname == "/user/register"){
    document.getElementById("register").onclick = () => {
        let password = document.getElementById("password").value
        if(password == document.getElementById("passwordCheck").value){
            let result = makeAccount(document.getElementById("username").value, password, document.getElementById("name"), document.getElementById("phone"), document.getElementById("email"));
            if(typeof(result) == "object"){
                window.location.replace("/");
            }else if(result == PROTOCOL.ERROR.USERNAME_TAKEN){
                document.getElementById("errorMessage").innerText = "Username is taken"
                document.getElementById("unscessfulMessage").hidden = false;
            }else{
                document.getElementById("errorMessage").innerText = "Registration rejected"
                document.getElementById("unscessfulMessage").hidden = false;
            }
        }else{

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
}