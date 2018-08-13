/**
 * Establish and use websocket communication
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/wsClient
 */
import * as PROTOCOL from "./protocol";
import getCookie from "./cookies"
import { SSL_OP_NO_TICKET } from "constants";

WS_PORT = 4543;
wsClients = [];

/** Class that creates and handles a websocket connection*/
class wsClient{
    /**
     * Creates a connection and client
     * @param {string} ip - server address
     * @param {integer} port - server port
     * @param {responseCallback} responseCallback - Callback to handle received messages
     */
    constructor(ip, port, responseCallback=null){
        this.ip = ip;
        this.port = port;
        this.responseCallback = [];
        if(responseCallback){
            this.addResponseCallback(responseCallback);
        }
        this.conn = new WebSocket("ws://" + ip + ":" + port);
        this.conn.onmessage = function(message){
            try{
                let data = JSON.parseFloat(message.data);
            }catch(e){
                if(typeof(e) == SyntaxError){
                    res = {};
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
            req = {};
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
        return new wsClient(ip, port, responseCallback);
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
* @param {object} message - json object received
*/

export {wsClient, WS_PORT};