/**
 * Interface for map editor
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
let selectTer1 = document.getElementById("selectTerritory");
let selectTer2 = document.getElementById("selectTerritory2");
let selectUnit1 = document.getElementById("selectUnit");
let selectUnit2 = document.getElementById("selectUnit2");

/**Reads local map data and creates a new Map object from it
 * @param {Object} evt - onchange event object containing file name
 */
function readMap(evt){
    let reader = new FileReader();
    reader.onload = (file) => {
        loadedMap = new Map(JSON.parse(file.target.result), "mapCanvas", true);
    };
    reader.readAsText(evt.target.files[0]);
}
document.getElementById("mapFile").addEventListener('change', readMap, false);
/**Updates the values in the dropdowns for territory selection based on the maps territory data
 */
function refreshTerritoryDropdowns(){
    selectTer1.innerHTML = "";
    selectTer2.innerHTML = "";
    let op = document.createElement("option");
    op.text = "None";
    selectTer1.options.add(op);
    selectTer2.options.add(op.cloneNode(true));
    for(let [territoryName, territory] of Object.entries(loadedMap.mapData["TERRITORY"])){
        let op = document.createElement("option");
        op.value = territoryName;
        op.text = territoryName;
        selectTer1.options.add(op);
        selectTer2.options.add(op.cloneNode(true));
    }
}
/**Updates the values in unit selection dropdown to match the selected territory
 * @param {object} territorySelect - The territory selector dropdown
 * @param {object} unitSelect - The unit selector dropdown
 */
function refreshUnitDropdown(territorySelect, unitSelect){
    unitSelect.innerHTML = "";
    let op = document.createElement("option");
    op.text = "None";
    unitSelect.options.add(op);
    if(territorySelect.selectedIndex != 0){
        let territoryName = territorySelect.options[territorySelect.selectedIndex].value;
        let units = loadedMap.mapData["TERRITORY"][territoryName]["UNIT"];
        if(units){
            for(let i = 0; i < units.length; ++i){
                let unit = units[i];
                let op = document.createElement("option");
                op.value = i;
                op.text = unit["TYPE"] + " " + i;
                unitSelect.options.add(op);
            }
        }
    }
}
/**Hides all editor and displays selected one
 * @param {string} editorId - id tag of editor to dispaly
 */
function changeEditor(editorId){
    for(let i = 0; i < editors.length; ++i){
        editors[i].hidden = true;
    }
    document.getElementById(editorId).hidden = false;
}
/**Updates Map object's selection and updates dropdowns to display selection
 * @param {Unit} unit - unit to select
 * @param {boolean} isPrimary - is this the primary or secondary(shift) select
 */
function selectUnit(unit, isPrimary=true){
    if(isPrimary){
        loadedMap.selectUnit(unit);
        if(!unit){
            loadedMap.secSelectUnit(unit);
            selectTer1.selectedIndex = 0;
            selectTer2.selectedIndex = 0;
            selectUnit1.selectedIndex = 0;
            selectUnit2.selectedIndex = 0;
            refreshUnitDropdown(selectTer1, selectUnit1);
            refreshUnitDropdown(selectTer2, selectUnit2);
        } else {
            for(let i = 0; i < selectTer1.length; ++i){
                if(unit.territoryName == selectTer1.options[i].value){
                    selectTer1.selectedIndex = i;
                    break;
                }
            }
            refreshUnitDropdown(selectTer1, selectUnit1);
            for(let i = 0; i < selectUnit1.length; ++i){
                if(unit.unitIndex == selectUnit1.options[i].value){
                    selectUnit1.selectedIndex = i;
                    break;
                }
            }
        }
    }else{
        loadedMap.secSelectUnit(unit);
        if(unit){
            for(let i = 0; i < selectTer2.length; ++i){
                if(unit.territoryName == selectTer2.options[i].value){
                    selectTer2.selectedIndex = i;
                    break;
                }
            }
            refreshUnitDropdown(selectTer2, selectUnit2);
            for(let i = 0; i < selectUnit2.length; ++i){
                if(unit.unitIndex == selectUnit2.options[i].value){
                    selectUnit2.selectedIndex = i;
                    break;
                }
            }
        }else{
            selectTer2.selectedIndex = 0;
        }
    }
}

document.getElementById("editMap").onclick = () => {
    changeEditor("mapConf");
};
document.getElementById("newMap").onclick = () => {
    //TODO: create new map
    console.warn("not implemented");
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
selectTer1.onchange = () => {
    refreshUnitDropdown(selectTer1, selectUnit1);
};
selectTer2.onchange = () => {
    rrefreshUnitDropdown(selectTer2, selectUnit2);
};
selectUnit1.onchange = (evt) => {
    let territoryName = selectTer1.options[selectTer1.selectedIndex].value;
    let territory = loadedMap.mapData["TERRITORY"][territoryName];
    selectUnit(new Unit(territoryName, territory, evt.target.value, territory["UNIT"][evt.target.value]));
};
selectUnit2.onchange = (evt) => {
    let territoryName = selectTer2.options[selectTer2.selectedIndex].value;
    let territory = loadedMap.mapData["TERRITORY"][territoryName];
    selectUnit(new Unit(territoryName, territory, evt.target.value, territory["UNIT"][evt.target.value]), false);
};
document.getElementById("newLink").onclick = () => {
    if(loadedMap.selectedUnit && loadedMap.selectedUnit2){
        loadedMap.addNewLink(loadedMap.selectedUnit, loadedMap.selectedUnit2);
    }
};
document.getElementById("rmLink").onclick = () => {
    if(loadedMap.selectedUnit && loadedMap.selectedUnit2){
        loadedMap.rmLink(loadedMap.selectedUnit, loadedMap.selectedUnit2);
    }
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
document.getElementById('mapCanvas').onmousedown = (evt) => {
    if(!mouseDown){
        let rect = canvas.getBoundingClientRect();
        mouseDown = true;
        if(loadedMap){
            let unit = loadedMap.findUnit((evt.clientX - rect.left), (evt.clientY - rect.top));
            selectUnit(unit, !keysDown["Shift"]);
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
