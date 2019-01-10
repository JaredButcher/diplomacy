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
        break;
        case PROTOCOL.ACTION.CHAT:
        break;
        case PROTOCOL.ACTION.UPDATE:
        break;
        case PROTOCOL.ACTION.JOIN:
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