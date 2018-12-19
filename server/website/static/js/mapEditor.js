/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/mapEditor
 */

import {Map} from './map.js';

let mapData = null;
let imgData = null;
let loadedMap = null;
let canvas = document.getElementById("mapCanvas");

function readMap(evt){
    let reader = new FileReader();
    reader.onload = (file) => {
        mapData = JSON.parse(file.target.result);
        loadedMap = new Map(mapData, "mapCanvas", true);
    };
    reader.readAsText(evt.target.files[0]);
}

document.getElementById("saveFile").onclick = (evt) => {
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
    }
}
document.getElementById('mapCanvas').onmouseup = function(evt){
    mouseDown = false;
}


