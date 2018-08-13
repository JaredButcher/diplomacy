/**
 * Manage login, logout, and account creation and modification
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/userManager
 */

import { wsClient, WS_PORT, obtainWsClient } from "./wsClient";
import * as PROTOCOL from "./protocol";

function login(username, password){
    ws = obtainWsClient(window.location.hostname, WS_PORT, message => {
        if(messagereq[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
            if(message.hasOwnProperty(PROTOCOL.FIELD.PLAYER)){
                //Login sucess
            }else{
                //LOGIN failed
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

function logout(){
    ws = obtainWsClient(window.location.hostname, WS_PORT);
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGOUT;
    ws.send(req);
}