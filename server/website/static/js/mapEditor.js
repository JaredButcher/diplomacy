/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/mapEditor
 */

import {Map} from './map.js';

let loadedMap = null;
let canvas = document.getElementById("mapCanvas");

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
        console.log("X: " + (evt.clientX - rect.left) + " Y: " + (evt.clientY - rect.top));
        mouseDown = true;
        if(loadedMap){
            let [territoryName, territory, unit] = loadedMap.unitSelect((evt.clientX - rect.left), (evt.clientY - rect.top));
            console.log("map loaded")
            console.log(territoryName)
            console.log(territory)
            console.log(unit)
        }
    }
}
document.getElementById('mapCanvas').onmouseup = function(evt){
    mouseDown = false;
}

window.stopStuff = () => {
    loadedMap = null;
}
