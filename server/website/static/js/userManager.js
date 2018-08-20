/**
 * Manage login, logout, and account creation and modification
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/userManager
 */

import { wsClient, WS_PORT, obtainWsClient } from "./wsClient";
import * as PROTOCOL from "./protocol";

/**
 * Login user
 * @param {string} username 
 * @param {string} password
 * @returns {bool} was login sucessful
 */
function login(username, password){
    ws = obtainWsClient(responseCallback = message, isBlob => {
        if(!isBlob && message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
            if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                return true;
            }else{
                return false;
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
 * @returns {bool} Was registration sucessful
 */
function makeAccount(username, password, name=null, phone=null, email=null){
    ws = obtainWsClient(window.location.hostname, WS_PORT, message => {
        if(messagereq[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
            if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                return true;
            }else{
                return false;
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
    ws = obtainWsClient(window.location.hostname, WS_PORT);
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGOUT;
    ws.send(req);
}