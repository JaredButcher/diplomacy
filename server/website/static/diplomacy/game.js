/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/game
 */

import {Unit, Map, DISPLAYMODE} from '../js/map.js';
import {MapDraw} from '../js/mapDraw.js';
import * as PROTOCOL from '../js/protocol.js';
import {WsClient, WS_PORT} from '../js/wsClient';

let gameMap = new map.Map('/static/maps/Europe.json', 'gameCanvas');
let canvas = new MapDraw("gameCanvas");
let gameId = null;
let map = null;
let gameInfo = null;
let ws = WsClient.obtainWsClient(window.location.hostname, WS_PORT, (message) => {
    switch(message[PROTOCOL.FIELD.ACTION]){
        case PROTOCOL.ACTION.VIEW_GAME:
            gameInfo = message[PROTOCOL.FIELD.GAME];
            map = new Map(gameInfo[PROTOCOL.GAME.MAP], "gameCanvas", DISPLAYMODE.GAME, (newMap) => {

            });
            document.getElementById("gameName").innerText = gameInfo[PROTOCOL.GAME.NAME];
            let turn = gameInfo[PROTOCOL.GAME.TURN];
            document.getElementById("gameYear").innerText = `${(turn % 2 == 0)? "Spring" : "Fall"} ${1901 + Math.floor(turn / 2)}`;
            let phase = "";
            switch(gameInfo[PROTOCOL.GAME.CURRENT_PHASE]){
                case PROTOCOL.PHASE.DIPLOMACY:
                    phase = "Diplomacy";
                break;
                case PROTOCOL.PHASE.RETREAT:
                    phase = "Retreat and Disband";
                break;
                case PROTOCOL.PHASE.ADJUST:
                    phase = "Gaining and Losing Units";
                break;
                case PROTOCOL.PHASE.DIPLOMACY:
                    phase = "Game Over";
                break;
            }
            document.getElementById("gamePhase").innerText = phase;
        break;
        case PROTOCOL.ACTION.CHAT:
        break;
        case PROTOCOL.ACTION.UPDATE:
        break;
        case PROTOCOL.ACTION.JOIN:
        break;
        case PROTOCOL.ACTION.CHAT:
        break;
    }
});

function getGetParameter(name){
    for(let param of window.location.search.substr(1).split("&")){
        if(param[0] == name){
            return decodeURIComponent(param[1]);
        }
    }
    return null;
}

function loadGame(){
    gameId = getGetParameter("id");
    req = {};
    req[PROTOCOL.FIELD.ACTION] = PROTOCOL.ACTION.VIEW_GAME;
    req[PROTOCOL.FIELD.GAME] = {};
    req[PROTOCOL.FIELD.GAME][PROTOCOL.GAME.ID] = gameId;

}

let mouseDown = false;
document.getElementById('gameCanvas').onmousedown = function(evt){
    if(!mouseDown){
        let rect = canvas.getBoundingClientRect();
        mouseDown = true;
        let x = Math.round(evt.clientX - rect.left);
        let y = Math.round(evt.clientY - rect.top);
        if(map){
            map.selectUnit(map.findUnit(x, y));
        }
    }
}
document.getElementById('gameCanvas').onmouseup = function(evt){
    mouseDown = false;
}

loadGame();