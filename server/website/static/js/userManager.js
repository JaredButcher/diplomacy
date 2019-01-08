/**
 * Manage login, logout, and account creation and modification
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/userManager
 */

import { WsClient, WS_PORT } from "./wsClient.js";
import * as PROTOCOL from "./protocol.js";
import { setCookie, getCookie, rmCookie } from "./cookies.js";

let user = {};

/**
 * Login user
 * @param {string} username 
 * @param {string} password
 * @returns {Promise(object)} was login sucessful then will return user object, nothing if failed
 */
function login(username, password, remember){
    return new Promise((resolve, reject) => {
        let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
            if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
                ws.removeResponseCallback();
                if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                    setUserInfo(message[PROTOCOL.FIELD.PLAYER]);
                    resolve(message[PROTOCOL.FIELD.PLAYER]);
                }else{
                    reject();
                }
            }
        });
        let req = {};
        req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGIN;
        req[PROTOCOL.FIELD.PLAYER] = {};
        req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.USERNAME] = username;
        req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PASSWORD] = password;
        if(remember){
            req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.SAVEDLOGIN] = true;
        }
        ws.send(req);
    });
}

/**
 * Make new account
 * @param {string} username 
 * @param {string} password 
 * @param {string} [name] 
 * @param {string} [phone] 
 * @param {string} [email]
 * @returns {Promise(object | number)} was registration sucessful returns player object, otherwise returns the error code
 */
function makeAccount(username, password, name=null, phone=null, email=null){
    return new Promise((resolve, reject) => {
        let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
            if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
                ws.removeResponseCallback();
                if(message[PROTOCOL.FIELD.PLAYER]){
                    resolve(message[PROTOCOL.FIELD.PLAYER]);
                }else{
                    reject(message[PROTOCOL.FIELD.ERROR]);
                }
            }
        });
        let req = {};
        req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.REGISTER;
        req[PROTOCOL.FIELD.PLAYER] = {};
        req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.USERNAME] = username;
        req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PASSWORD] = password;
        if(name) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.NAME] = name;
        if(phone) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.PHONE] = phone;
        if(email) req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.EMAIL] = email;
        ws.send(req);
    });
}

/**
 * logout the currently loged in user
 */
function logout(){
    let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT);
    let req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGOUT;
    let remember = getCookie("remember");
    rmCookie("remember");
    if(remember){
        req[PROTOCOL.FIELD.PLAYER] = remember;
    }
    ws.send(req);
    setUserInfo({});
}

function establishSession(){
    WsClient.obtainWsClient(window.location.hostname, WS_PORT);
}

function setUserInfo(userInfo={}){
    user[PROTOCOL.USER.ID] = userInfo[PROTOCOL.USER.ID];
    user[PROTOCOL.USER.USERNAME] = userInfo[PROTOCOL.USER.USERNAME];
    user[PROTOCOL.USER.NAME] = userInfo[PROTOCOL.USER.NAME];
    user[PROTOCOL.USER.PHONE] = userInfo[PROTOCOL.USER.PHONE];
    user[PROTOCOL.USER.EMAIL] = userInfo[PROTOCOL.USER.EMAIL];
    user[PROTOCOL.USER.SAVEDLOGIN] = userInfo[PROTOCOL.USER.SAVEDLOGIN];
    document.getElementById("headAccountButton").style.display = user[PROTOCOL.USER.ID] == undefined ? "none" : "inline-block";
    document.getElementById("headAccountButton").innerText = user[PROTOCOL.USER.USERNAME];
    document.getElementById("headMakeGameButton").style.display = user[PROTOCOL.USER.ID] == undefined ? "none" : "inline-block";
    document.getElementById("headMyGamesButton").style.display = user[PROTOCOL.USER.ID] == undefined ? "none" : "inline-block";
    document.getElementById("headRegisterButton").style.display = user[PROTOCOL.USER.ID] != undefined ? "none" : "inline-block";
    document.getElementById("headLoginButton").style.display = user[PROTOCOL.USER.ID] != undefined ? "none" : "inline-block";
    document.getElementById("headLogoutButton").style.display = user[PROTOCOL.USER.ID] == undefined ? "none" : "inline-block";
}

function getUserInfo(){
    return userInfop;
}

document.getElementById("headLogoutButton").onclick = logout;

export{login, logout, makeAccount, setUserInfo, getUserInfo, establishSession};