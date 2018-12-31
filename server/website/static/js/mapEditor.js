/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/mapEditor
 */

import {Map, Unit} from './map.js';

let loadedMap = null;
let canvas = document.getElementById("mapCanvas");
let keysDown = {};
let editors = document.getElementsByClassName("editorTool");
let territoryBeingEdited = null;
let unitBeingEdited = null;

function readMap(evt){
    let reader = new FileReader();
    reader.onload = (file) => {
        loadedMap = new Map(JSON.parse(file.target.result), "mapCanvas", true);
    };
    reader.readAsText(evt.target.files[0]);
}
document.getElementById("mapFile").addEventListener('change', readMap, false);

function refreshTerritoryDropdowns(){
    let ter1 = document.getElementById("selectTerritory");
    let ter2 = document.getElementById("selectTerritory2");
    ter1.innerHTML = "";
    ter2.innerHTML = "";
    let op = document.createElement("option");
    op.text = "None";
    ter1.options.add(op);
    ter2.options.add(op.cloneNode(true));
    for(let [territoryName, territory] of Object.entries(loadedMap.mapData["TERRITORY"])){
        let op = document.createElement("option");
        op.value = territoryName;
        op.text = territoryName;
        ter1.options.add(op);
        ter2.options.add(op.cloneNode(true));
    }
}
window.refreshTerritoryDropdowns = refreshTerritoryDropdowns;

function changeEditor(editorId){
    for(let i = 0; i < editors.length; ++i){
        editors[i].hidden = true;
    }
    document.getElementById(editorId).hidden = false;
}
document.getElementById("editMap").onclick = () => {
    changeEditor("mapConf");
};
document.getElementById("newMap").onclick = () => {
    console.warn("TODO: create new map");
    changeEditor("mapConf");
};
document.getElementById("editCountry").onclick = () => {
    changeEditor("countryConf");
};
document.getElementById("newTerritory").onclick = () => {
    territoryBeingEdited = null;
    changeEditor("territoryConf");
};
document.getElementById("showAllLinks").onclick = (evt) => {
    loadedMap.setDrawAllLinks(evt.path[0].checked);
};
document.getElementById("editTerritory").onclick = () => {
    if(loadedMap.selectedUnit){
        territoryBeingEdited = loadedMap.selectedUnit;
        changeEditor("territoryConf");
    }
};
document.getElementById("newUnit").onclick = () => {
    unitBeingEdited = null;
    changeEditor("unitConf");
};
document.getElementById("editUnit").onclick = () => {
    if(loadedMap.selectedUnit){
        unitBeingEdited = loadedMap.selectedUnit;
        changeEditor("unitConf");
    }
};
document.getElementById("newLink").onclick = () => {

};
document.getElementById("rmLink").onclick = () => {
    
};

//Loads default map
document.addEventListener('DOMContentLoaded', () => {
    loadedMap = new Map('/static/maps/defaultMap.json', 'mapCanvas', true, refreshTerritoryDropdowns);
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
