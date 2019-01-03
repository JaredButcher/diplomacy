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
let currentEditor = "mainEditor";
let currentEdited = null;
let selectTer1 = document.getElementById("selectTerritory");
let selectTer2 = document.getElementById("selectTerritory2");
let selectUnit1 = document.getElementById("selectUnit");
let selectUnit2 = document.getElementById("selectUnit2");
let currentCPC = null;

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
 * @param {string} editorId - id tag of editor to display
 * mainEditor, mapConf, territoryConf, unitConf, countryConf, playerCountConf, playerCountContryConf
 */
function changeEditor(editorId){
    currentEditor = editorId;
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
    currentEdited = new Unit(null, {"UNIT":[]}, null, null);
    changeEditor("territoryConf");
};
document.getElementById("showAllLinks").onclick = (evt) => {
    loadedMap.setDrawAllLinks(evt.path[0].checked);
};
document.getElementById("editTerritory").onclick = () => {
    if(loadedMap.selectedUnit){
        currentEdited = loadedMap.selectedUnit;
        document.getElementById("territoryName").value = currentEdited.territoryName;
        if(currentEdited.territory["MARKER"]){
            document.getElementById("territorySupply").checked = true;
            document.getElementById("territoryX").value = currentEdited.territory["MARKER"]["X"];
            document.getElementById("territoryY").value = currentEdited.territory["MARKER"]["Y"];
        }
        if(currentEdited.territory["CONVOY"]){
            document.getElementById("territoryConvoy").checked = true;
            document.getElementById("territoryConvoyX").value = currentEdited.territory["CONVOY"]["X"];
            document.getElementById("territoryConvoyY").value = currentEdited.territory["CONVOY"]["Y"];
        }
        changeEditor("territoryConf");
    }
};
document.getElementById("newUnit").onclick = () => {
    if(loadedMap.selectedUnit){
        currentEdited = new Unit(loadedMap.selectedUnit.territoryName, loadedMap.selectedUnit.territory, null, {"TYPE":null,"X":null,"Y":null});
        document.getElementById("unitTerritoryName").innerText = "Territory: " + currentEdited.territoryName;
        changeEditor("unitConf");
    }
};
document.getElementById("editUnit").onclick = () => {
    if(loadedMap.selectedUnit){
        currentEdited = loadedMap.selectedUnit;
        document.getElementById("unitTerritoryName").innerText = "Territory: " + currentEdited.territoryName;
        for(let elm of document.getElementsByName("unitType")){
            if(elm.value == currentEdited.unit["TYPE"]){
                elm.checked = true;
                break;
            }
        }
        document.getElementById("unitX").value = currentEdited.unit["X"];
        document.getElementById("unitY").value = currentEdited.unit["Y"];
        let coast = document.getElementById("unitCoast");
        if(currentEdited.unit["COAST"] != null){
            for(let i in coast.options){
                if(currentEdited.unit["COAST"] == coast.options[i].value){
                    coast.selectedIndex = i;
                }
            }
        }else{
            coast.selectedIndex = 0;
        }

        changeEditor("unitConf");
    }
};
document.getElementById("applyUnit").onclick = () => {
    currentEdited.unit["TYPE"] = document.querySelector('input[name=unitType]:checked').value;
    let coast = document.getElementById("unitCoast").value;
    if(coast != "None"){
        currentEdited.unit["COAST"] = parseInt(coast);
    }
    if(currentEdited.unit["TYPE"] && currentEdited.unit["X"] && currentEdited.unit["Y"]){
        loadedMap.addUnit(currentEdited);
    }else{
        console.warn("Unit not added");
    }
    changeEditor("mainEditor");
};
document.getElementById("rmUnit").onclick = () => {
    if(currentEdited.unitIndex != null){
        console.log("Remove")
        loadedMap.rmUnit(currentEdited);
    }
    changeEditor("mainEditor");
};
selectTer1.onchange = () => {
    if(selectTer1.selectedIndex != 0){
        let territoryName = selectTer1.options[selectTer1.selectedIndex].value;
        loadedMap.selectUnit(new Unit(territoryName, loadedMap.mapData["TERRITORY"][territoryName], null, null));
    }
    refreshUnitDropdown(selectTer1, selectUnit1);
};
selectTer2.onchange = () => {
    if(selectTer2.selectedIndex != 0){
        let territoryName = selectTer2.options[selectTer2.selectedIndex].value;
        loadedMap.secSelectUnit(new Unit(territoryName, loadedMap.mapData["TERRITORY"][territoryName], null, null));
    }
    refreshUnitDropdown(selectTer2, selectUnit2);
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
document.getElementById("applyTerritory").onclick = () => {
    currentEdited.territoryName = document.getElementById("territoryName").value;
    if(document.getElementById("territorySupply").checked){
        currentEdited.territory["MARKER"] = {"X": document.getElementById("territoryX").value, "Y": document.getElementById("territoryY").value};
    }
    if(document.getElementById("territoryConvoy").checked){
        currentEdited.territory["CONVOY"] = {"X": document.getElementById("territoryConvoyX").value, "Y": document.getElementById("territoryConvoyY").value};
    }
    if(currentEdited.territoryName != null){
        loadedMap.applyTerritory(currentEdited);
    }
    refreshTerritoryDropdowns();
    changeEditor("mainEditor");
};
document.getElementById("rmTerritory").onclick = () => {
    if(currentEdited.territoryName != null){
        loadedMap.rmTerritory(currentEdited);
        refreshTerritoryDropdowns();
    }
    changeEditor("mainEditor");
}
document.getElementById("countryConfReturn").onclick = () => {
    changeEditor("mainEditor");
}
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
        let x = Math.round(evt.clientX - rect.left);
        let y = Math.round(evt.clientY - rect.top);
        if(loadedMap && currentEditor == "mainEditor"){
            let unit = loadedMap.findUnit(x, y);
            selectUnit(unit, !keysDown["Shift"]);
        } else if(currentEditor == "unitConf"){
            currentEdited.unit["X"] = x;
            currentEdited.unit["Y"] = y;
            document.getElementById("unitX").value = x;
            document.getElementById("unitY").value = y;
        } else if(currentEditor == "territoryConf"){
            if(keysDown["Shift"] && document.getElementById("territoryConvoy").checked){
                currentEdited.territory["CONVOY"] = {"X": x, "Y": y};
                document.getElementById("territoryConvoyX").value = x;
                document.getElementById("territoryConvoyY").value = y;
            }else if(document.getElementById("territorySupply").checked){
                currentEdited.territory["MARKER"] = {"X": x, "Y": y};
                document.getElementById("territoryX").value = x;
                document.getElementById("territoryY").value = y;
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
let playerCountButtons = document.querySelectorAll("input[name=playerCount]");
for(let button of playerCountButtons){
    button.onclick = () => {
        currentCPC = button.value;
        let editor = document.getElementById("playerCountConf");
        for(let elm of editor.querySelectorAll("div[name=playerCountCountryConf]")){
            editor.removeChild(elm);
        }
        for(let i = 0; i < currentCPC; ++i){
            let CPCId = "CPCId" + i;
            let inputFields = `<div name="playerCountCountryConf">
                                    <label>Name: </label><input type="text" class="${CPCId}" name="playerCountCountryName">
                                    <label>Color: </label><input type="text" class="${CPCId}" name="playerCountCountryColor">
                                    <p class="${CPCId}" name="listPlayerCountUnits"></p>
                                    <label>Territory: </label>
                                    <select class="${CPCId}" name="countrySelectTerritory">
                                        <option value="temp">temp</option>
                                    </select>
                                    <select class="${CPCId}" name="countrySelectUnit">
                                        <option value="temp">temp</option>
                                    </select>
                                    <input type="button" value="Remove territory" class="${CPCId}" name="rmLinkTerritoryCountry"/>
                                    <input type="button" value="Add territory" class="${CPCId}" name="linkTerritoryCountry"/>
                                </div>`
            editor.innerHTML = inputFields + editor.innerHTML;
        }
        changeEditor("playerCountConf");
    }
}
