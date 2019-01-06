/**
 * Establish and use websocket communication
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/wsClient
 */
import * as PROTOCOL from "./protocol.js";
import {getCookie} from "./cookies.js"

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
        if(responseCallback){
            this.addResponseCallback(responseCallback);
        }
        this.conn = new WebSocket("ws://" + ip + ":" + port);
        this.conn.onmessage = function(message){
            try{
                let data = JSON.parse(message.data);
            }catch(e){
                if(typeof(e) == SyntaxError){
                    let res = {};
                    res[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.ERROR;
                    res[PROTOCOL.FIELD.ERROR] = PROTOCOL.ERROR.BAD_REQUEST;
                    this.send(res);
                }else{
                    throw e;
                }
                return;
            }
            this.responseCallback.forEach(callback => {
                callback(data);
            });
        };
        this.conn.onopen = function(){
            console.log("open")
            let req = {};
            req[PROTOCOL.FIELD.ACTION] = PROTOCOL.FIELD.UPDATE;
            req[PROTOCOL.FIELD.PLAYER] = getCookie("session");
            this.send(req);
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
            if(wsClients[i].ip == ip && wsClients[i].port == port){
                wsClients[i].addResponseCallback(responseCallback);
                return wsClients[i];
            }
        }
        return new WsClient(ip, port, responseCallback);
    }
    /**
     * Send to server
     * @param {(string|object)} message - to send to server, object will be converted to json string
     */
    send(message){
        if(typeof(message) != "string"){
            message = JSON.stringify(message);
        }
        this.conn.send(message);
    }
    /**
     * Adds another callback for received messages
     * @param {responseCallback} responseCallback - callback to add
     */
    addResponseCallback(responseCallback){
        this.responseCallback.push(responseCallback);
    }
    /**
     * Removes a callback for received messages once, if duplicates exist they will not be removed
     * @param {responseCallback} responseCallback] - callback to remove
     */
    removeResponseCallback(responseCallback){
        for(let i = 0; i < this.responseCallback.length; ++i){
            if(this.responseCallback[i] == responseCallback){
                this.responseCallback.splice(i, 1);
                return;
            }
        }
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
