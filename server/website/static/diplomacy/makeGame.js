import {Map} from "../js/map.js";
import {getUserInfo} from "../js/userManager.js";
import * as PROTOCOL from "../js/protocol.js";
import {WsClient, WS_PORT} from "../js/wsClient.js";

let mapSelect = document.getElementById("selectMap");
let canvas = document.getElementById("mapCanvas");
let gameConf = document.getElementById("gameConf");
let playerSelect = document.getElementById("playerCount");
let gameName = document.getElementById("gameName");
let phaseLength = document.getElementById("phaseLength");
let password = document.getElementById("gamePassword");
let error = document.getElementById("errorMessage");
let map = null;
document.getElementById("loadMap").onclick = () => {
    map = new Map(`../static/maps/${mapSelect.options[mapSelect.selectedIndex].value}.json`, "mapCanvas", false, (newMap) => {
        canvas.style.display = "initial";
        gameConf.style.display = "grid";
        playerSelect.innerHTML = "";
        for(let [key, country] of Object.entries(newMap.mapData["COUNTRY"])){
            let elm = document.createElement("option");
            elm.innerText = key;
            elm.value = key;
            playerSelect.options.add(elm);
        }
        document.getElementById("editorContainer").classList.add("left");
        gameName.value = `${getUserInfo()[PROTOCOL.USER.USERNAME]} ${mapSelect.options[mapSelect.selectedIndex].value}`;
        map.setDefaultCountryDraw(playerSelect.options[playerSelect.selectedIndex].value);
    });
}
canvas.style.display = "None";
gameConf.style.display = "None";
playerSelect.onchange = () => {
    map.setDefaultCountryDraw(playerSelect.options[playerSelect.selectedIndex].value);
}
document.getElementById("createGame").onclick = () => {
    if(getUserInfo()[PROTOCOL.USER.ID] != null){
        let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
            if(message[PROTOCOL.FIELD.ACTION] == PROTOCOL.ACTION.CREATE_GAME){
                if(message[PROTOCOL.FIELD.GAME]){
                    //Sucess, send to game
                    window.location.replace(`/diplomacy/game?id=${message[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.ID]}`);
                }else{
                    //Game create failed
                    error.innerText = "Failed to create game"
                    error.hidden = false;
                }
                ws.removeResponseCallback();
            }
        });
        let req = {};
        req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.CREATE_GAME;
        req[PROTOCOL.FIELD.GAME] = {};
        req[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.NAME] = gameName.value;
        req[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.TIMER_DURATION] = phaseLength.value;
        req[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.MAX_PLAYERS] = playerSelect.options[playerSelect.selectedIndex].value;
        if(password.value != ""){
            req[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.PASSWORD] = password.value;
        }
        ws.send(req);
    }else{
        window.location.replace("/user/register");
    }
}
