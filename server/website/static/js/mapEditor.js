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


