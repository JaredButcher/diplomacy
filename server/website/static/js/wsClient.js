/**
 * Establish and use websocket communication
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/wsClient
 */
import * as PROTOCOL from "./protocol.js";
import {getCookie, setCookie} from "./cookies.js";
import {setUserInfo} from "./userManager.js";

const WS_PORT = 4543;
const wsClients = [];

/** Class that creates and handles a websocket connection*/
class WsClient{
    /**
     * Creates a connection and client
     * @param {string} ip - server address
     * @param {integer} port - server port
     * @param {responseCallback} responseCallback - Callback to handle received messages
     */
    constructor(ip=window.location.hostname, port=WS_PORT, responseCallback=null){
        this.ip = ip;
        this.port = port;
        this.responseCallback = [];
        this.sendQueue = [];
        this.open = false;
        this.removeCurrentCallback = false;
        wsClients.push(this);
        if(responseCallback){
            this.addResponseCallback(responseCallback);
        }
        this.conn = new WebSocket("ws://" + ip + ":" + port);
        let self = this
        this.conn.onmessage = function(message){
            try{
                message = JSON.parse(message.data);
            }catch(e){
                if(typeof(e) == SyntaxError){
                    let res = {};
                    res[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.ERROR;
                    res[PROTOCOL.FIELD.ERROR] = PROTOCOL.ERROR.BAD_REQUEST;
                    self._send(res);
                }else{
                    throw e;
                }
                return;
            }
            console.log("received")
            console.log(message)
            if(self.open){
                for(let i = self.responseCallback.length - 1; i >= 0; --i){
                    self.responseCallback[i](message);
                    if(self.removeCurrentCallback){
                        self.responseCallback.splice(i, 1);
                    }
                    self.removeCurrentCallback = false;
                }
                self.responseCallback.forEach(callback => {
                    callback(message);
                });   
            }else if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.SESSION){
                self.open = true;
                if(message[PROTOCOL.FIELD.PLAYER]){
                    if(message[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.ID]){
                        setUserInfo(message[PROTOCOL.FIELD.PLAYER]);
                    }else{
                        setCookie("session", message[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.SESSION], 1);
                        let remember = getCookie("remember");
                        if(remember){
                            let req = {};
                            req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LOGIN;
                            req[PROTOCOL.FIELD.PLAYER] = {};
                            req[PROTOCOL.FIELD.PLAYER][PROTOCOL.USER.SAVEDLOGIN] = remember;
                            self.addResponseCallback((message) => {
                                if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LOGIN){
                                    if(message[PROTOCOL.FIELD.PLAYER]){
                                        setUserInfo(message[PROTOCOL.FIELD.PLAYER]);
                                        self.removeResponseCallback();
                                    }
                                }
                            });
                            self.send(req);
                        }
                    }
                }
                for(let message of self.sendQueue){
                    self._send(message);
                }
            }
        };
        this.conn.onopen = function(evt){
            let req = {};
            req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.SESSION;
            let session = getCookie("session");
            if(session != null){
                req[PROTOCOL.FIELD.PLAYER] = session;
            }
            self._send(req);
        };
        this.conn.onclose = function(){
            
        };
        this.conn.onerror = function(evt){
            console.log("Websocket error has occured: ", evt);
        };
    }
    /**
     * Checks if there is an existing connection to given ip and port and returns it if there is one, if not creates one
     * @param {string} ip - address to connect to
     * @param {integer} port - port to connect to
     * @param {responseCallback} responseCallback - callback to handle received messages
     */
    static obtainWsClient(ip, port, responseCallback){
        for(let i = 0; i < wsClients.length; ++i){
            if(wsClients[i].ip == ip && wsClients[i].port == port && wsClients[i].conn.readyState < 2){
                wsClients[i].addResponseCallback(responseCallback);
                return wsClients[i];
            }
        }
        return new WsClient(ip, port, responseCallback);
    }
    _send(message){
        if(typeof(message) != "string"){
            message = JSON.stringify(message);
        }
        console.log("SEND:")
        console.log(message)
        this.conn.send(message);
    }
    /**
     * Send to server
     * @param {(string|object)} message - to send to server, object will be converted to json string
     */
    send(message){
        if(this.open){
            this._send(message);
        }else{
            this.sendQueue.push(message);
        }
    }
    /**
     * Adds another callback for received messages
     * @param {responseCallback} responseCallback - callback to add
     */
    addResponseCallback(responseCallback){
        this.responseCallback.push(responseCallback);
    }
    /**
     * Removes the currently executing callback once complete
     */
    removeResponseCallback(){
        this.removeCurrentCallback = true;
    }
    /**
     * Closes the websocket
     */
    close(){
        conn.close();
    }
}

/**
* Callback type used for receiveing a valid message in wsClient
* @callback responseCallback
* @param {object} message - json object received or blob
* @param {string} blobURI - if message is blob then URI of blob
*/

export {WsClient, WS_PORT};
