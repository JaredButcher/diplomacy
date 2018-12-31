/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/mapEditor
 */

import {Map, Unit} from './map.js';

let loadedMap = null;
let canvas = document.getElementById("mapCanvas");
let keysDown = {};

function readMap(evt){
    let reader = new FileReader();
    reader.onload = (file) => {
        loadedMap = new Map(JSON.parse(file.target.result), "mapCanvas", true);
    };
    reader.readAsText(evt.target.files[0]);
}

//Loads default map
document.addEventListener('DOMContentLoaded', () => {
    loadedMap = new Map('/static/maps/defaultMap.json', 'mapCanvas', true);
});

document.getElementById("saveFile").onclick = (evt) => {
    let mapData = loadedMap.getMapData();
    if(!mapData || !mapData.NAME){
        console.error("Invalid map data");
        return;
    }
    let element = document.createElement("a");
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(mapData));
    element.setAttribute('download', mapData.NAME + ".json")
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};



document.getElementById("mapFile").addEventListener('change', readMap, false);

let mouseDown = false;
document.getElementById('mapCanvas').onmousedown = function(evt){
    if(!mouseDown){
        let rect = canvas.getBoundingClientRect();
        mouseDown = true;
        if(loadedMap){
            let unit = loadedMap.findUnit((evt.clientX - rect.left), (evt.clientY - rect.top));
            if(keysDown["Shift"]){
                console.log("shift")
                loadedMap.secSelectUnit(unit);
            }else{
                loadedMap.selectUnit(unit);
                if(!unit){
                    loadedMap.secSelectUnit(unit);
                }
            }
        }
    }
}
document.getElementById('mapCanvas').onmouseup = function(evt){
    mouseDown = false;
}
document.addEventListener("keydown", (evt) => {
    if (keysDown[evt.key] == true){ return; }
    keysDown[evt.key] = true;
});

document.addEventListener("keyup", (evt) => {
    keysDown[evt.key] = false;
});

window.stopStuff = () => {
    loadedMap = null;
}
