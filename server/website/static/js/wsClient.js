/**
 * Establish and use websocket communication
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/wsClient
 */
import * as PROTOCOL from "diplomacy/protocol";
import getCookie from "diplomacy/cookies"

class wsClient{
    /**
     * Creates a connection and client
     * @param {string} ip - server address
     * @param {integer} port - server port
     */
    /**
     * Function to call upown receiveing a valid message
     * @callback responseCallback
     * @param {object} message - json object received
     */
    constructor(ip, port, responseCallback){
        this.ip = ip;
        this.port = port;
        this.responseCallback = responseCallback;
        this.conn = new WebSocket("ws://" + ip + ":" + port);
        this.conn.onmessage = function(message){
            try{
                let data = JSON.parseFloat(message.data);
            }catch(SyntaxError e){
                res = {};
                res[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.ERROR;
                res[PROTOCOL.FIELD.ERROR] = PROTOCOL.ERROR.BAD_REQUEST;
                this.send(res);
                return;
            }
            this.responseCallback(data);
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
     * 
     * @param {(string|object)} message - to send to server, object will be converted to json string
     */
    send(message){
        if(typeof(message) != "string"){
            message = JSON.stringify(message);
        }
        this.conn.send(message);
    }
    /**
     * Closes the websocket
     */
    close(){
        conn.close();
    }
}

export {wsClient};