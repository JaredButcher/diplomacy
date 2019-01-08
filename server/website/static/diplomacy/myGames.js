import * as PROTOCOL from "../js/protocol.js";
import {WsClient, WS_PORT} from "../js/wsClient.js";

let gameList = document.getElementById("gamesList");

let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
    if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.LIST_GAMES){
        if(message[PROTOCOL.FIELD.ERROR] == PROTOCOL.ERROR.AUTH_REQUIRED){
            window.location.replace("/user/register")
        }
        for(let game of message[PROTOCOL.FIELD.GAME]){
            gameList.innerHTML += 
            `<div id="id${game[PROTOCOL.GAME.ID]}" class="framed" style="margin: auto; width: 600px;" name="game">
                <p>Name: ${game[PROTOCOL.GAME.NAME]}</p>
                <p>Players: ${game[PROTOCOL.GAME.PLAYERS]}/${game[PROTOCOL.GAME.MAX_PLAYERS]}</p>
                <p>Owner: ${game[PROTOCOL.GAME.OWNER]}</p>
                <p>Map: ${game[PROTOCOL.GAME.MAP]}</p>
                <p>Turn: ${game[PROTOCOL.GAME.TURN]}</p>
            </div>`
        }
        for(let elm of document.getElementsByName("game")){
            elm.onclick = () => {
                window.location.replace(`/diplomacy/game?id=${elm.id.substring(2)}`);
            }
        }
        ws.removeResponseCallback();
    }
});
let req = {};
req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.LIST_GAMES;
req[PROTOCOL.FIELD.PLAYER] = true;
ws.send(req);