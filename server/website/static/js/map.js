/**
 * Used for map interactins
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/map
 */

import * as PROTOCOL from "./protocol.js";
import {wsClient} from "./wsClient.js";
import {MapDraw} from "./mapDraw.js";

/* map keywords
"NAME"
"DISCRIPTION"
"IMG"
"SIZE"
"MAX_DISTANCE"
"X"
"Y"
"COUNTRY"
"ID"
"COLOR"
"TERRITORIES"
"TERRITORY"
"UNIT"
"TYPE"
"ARMY"
"FLEET"
"COAST"
"LINK"
*/

class Unit{
    /**Used to hold and compare basic infomation about units
     * Any value can be null, unit values can be null to hold territory info
     * @param {string} territoryName 
     * @param {object} territory - territory object as found in the map data
     * @param {number} unitIndex - index of unit in territory's unit list
     * @param {object} unit - unit object as found in map data
     */
    constructor(territoryName, territory, unitIndex, unit){
        this.territoryName = territoryName;
        this.territory = territory;
        this.unitIndex = unitIndex;
        this.unit = unit;
    }
    isInLink(link){
        return link[0][0] == this.territoryName && link[0][1] == this.unitIndex || link[1][0] == this.territoryName && link[1][1] == this.unitIndex;
    }
}

class Map{
    /**
     * Create and manage game map
     * @param {string | object} mapData - url to json file containing map infomation or object containing map data
     * @param {string} canvas - id of canvas to draw map on
     * @param {bool} editorMode - will dispaly all connections and positions
     * @param {function} callback - called after map is finished loading
     */
    constructor(mapData, canvas, editorMode=false, callback=null){
        this.editorMode = editorMode;
        this.draw = new MapDraw(canvas);
        this.selectedUnit = null;
        this.selectedUnit2 = null;
        this.drawAllLinks = false;
        this.callback = callback;
        this.drawing = false;
        if(typeof(mapData) == "string"){
            var self = this;
            let req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    self.mapData = JSON.parse(this.responseText);
                    self.img = new Image();
                    self.img.src = self.mapData.IMG;
                    self.img.onload = () => { 
                        self.drawing = true;
                        self.drawMap();
                        if(self.callback){
                            self.callback(self);
                        }
                    };
                }
            }
            req.open("GET", mapData, true);
            req.send();
        }else if(typeof(mapData) == "object"){
            this.mapData = mapData;
            this.img = new Image();
            this.img.src = this.mapData.IMG;
            this.img.onload = () => {
                this.drawing = true;
                this.drawMap();
                if(this.callback){
                    this.callback(this);
                }
            };
        }else{
            console.error("invalid type passed to Map")
        }
    }
    getMapData(){
        return this.mapData;
    }
    /**
     * Draw map
     */
    drawMap(){
        this.draw.clear();
        this.draw.ctx.drawImage(this.img, 0, 0);
        //Draw links
        for(let i = 0; i < this.mapData["LINK"].length; ++i){
            let link = this.mapData["LINK"][i];
            if(this.drawAllLinks || this.selectedUnit && (link[0][0] == this.selectedUnit.territoryName && this.selectedUnit.territory["UNIT"][link[0][1]] == this.selectedUnit.unit 
            || link[1][0] == this.selectedUnit.territoryName && this.selectedUnit.territory["UNIT"][link[1][1]] == this.selectedUnit.unit)){
                let unit1 = this.mapData["TERRITORY"][link[0][0]]["UNIT"][link[0][1]];
                let unit2 = this.mapData["TERRITORY"][link[1][0]]["UNIT"][link[1][1]];
                this.draw.drawLine('gray', unit1.X, unit1.Y, unit2.X, unit2.Y)
            }
        }
        for(let [territoryName, territory] of Object.entries(this.mapData["TERRITORY"])){
            //Draw supply points
            if(territory["MARKER"]){
                this.draw.drawDot('black', territory.MARKER.X, territory.MARKER.Y)
            }
            //Draw units
            if (this.editorMode){
                for(let i = 0; i < territory.UNIT.length; ++i){
                    let unit = territory.UNIT[i];
                    if(territory["CONVOY"] && unit["TYPE"] == "FLEET" && (this.drawAllLinks || this.selectedUnit && territoryName == this.selectedUnit.territoryName 
                        || this.selectedUnit2 && territoryName == this.selectedUnit2.territoryName)){
                        this.draw.drawConvoyRoute("blue", false, unit.X, unit.Y, territory.CONVOY.X, territory.CONVOY.Y);
                    }
                    if ((this.selectedUnit && unit == this.selectedUnit.unit) || (this.selectedUnit2 && unit == this.selectedUnit2.unit)){
                        this.draw.drawUnit('gray', unit.TYPE[0], unit.X, unit.Y, false, true);
                    }else{
                        this.draw.drawUnit('gray', unit.TYPE[0], unit.X, unit.Y);
                    }
                }
            }
        }
        if(this.drawing){
            requestAnimationFrame(() => this.drawMap());
        }
    }
    /**Finds unit being clicked on and returns it. If none then returns null in all fields
     * @param {float} x 
     * @param {float} y 
     * @returns [territoryName, territory, unit] or null
     */
    findUnit(x, y){
        let MAX_DISTANCE = this.mapData["MAX_DISTANCE"]; //Max distance between units within a territory, used to speed up calculations
        for(let [territoryName, territory] of Object.entries(this.mapData["TERRITORY"])){
            if(territory.UNIT){
                for(let i = 0; i < territory.UNIT.length; ++i){
                    let unit = territory.UNIT[i];
                    //Quick check if country near 
                    if(Math.abs(unit.X - x) > MAX_DISTANCE || Math.abs(unit.Y - y) > MAX_DISTANCE){
                        break;
                    }
                    if(Math.sqrt((x-unit.X)**2 + (y-unit.Y)**2) <= MapDraw.UNIT_SIZE()){
                        return new Unit(territoryName, territory, i, unit);
                    }
                }
            }
        }
        return null;
    }
    /**Sets unit as selected unit
     * @param {Unit} unit - unit to draw as selected
     */
    selectUnit(unit){
        this.selectedUnit = unit;
    }
    secSelectUnit(unit){
        this.selectedUnit2 = unit;
    }
    setDrawAllLinks(doDraw){
        this.drawAllLinks = doDraw;
    }
    /**Adds new link between the selected units, will not add repeat link
     * @param {Unit} unit1
     * @param {Unit} unit2
     */
    addNewLink(unit1, unit2){
        let links = this.mapData["LINK"];
        for(let link of links){
            if(unit1.isInLink(link) && unit2.isInLink(link)){ return; }
        }
        links.push([[unit1.territoryName, unit1.unitIndex], [unit2.territoryName, unit2.unitIndex]])
    }
    /**Removes link between given units
     * @param {Unit} unit1
     * @param {Unit} unit2
     */
    rmLink(unit1, unit2){
        let links = this.mapData["LINK"];
        for(let i = links.length - 1; i >= 0; --i){
            if(unit1.isInLink(links[i]) && unit2.isInLink(links[i])){
                links.splice(i, 1);
            }
        }
    }
    /**Adds given unit to map
     * @param {Unit} unit 
     */
    addUnit(unit){
        if(typeof(unit.territory) != "object"){
            unit.territory = {"UNIT": []};
            this.mapData["TERRITORY"][unit.territoryName] = unit.territory;
        }
        for(let otherUnit of unit.territory["UNIT"]){
            if(unit != otherUnit && otherUnit["TYPE"] == unit.unit["TYPE"] && (otherUnit["COAST"] == null || unit.unit["COAST"] == null)){
                console.warn("Cannot add repeat type unit without coast defined")
                return;
            }
        }
        if(unit.unitIndex){
            this.mapData["TERRITORY"][unit.territoryName]["UNIT"][unit.unitIndex] = unit.unit;
        }else{
            this.mapData["TERRITORY"][unit.territoryName]["UNIT"].push(unit.unit);
        }
    }
    /**Removes given unit
     * @param {Unit} unit 
     */
    rmUnit(unit){
        if(unit.unitIndex != null){
            this.mapData["TERRITORY"][unit.territoryName]["UNIT"].splice(unit.unitIndex, 1);
            let links = this.mapData["LINK"];
            for(let i = links.length - 1; i >= 0; --i){
                if(unit.isInLink(links[i])){
                    links.splice(i, 1);
                }
            }
            let units = unit.territory["UNIT"];
            for(let i in units){
                if(i >= unit.unitIndex){
                    let misplacedUnit = new Unit(unit.territoryName, unit.territory, i + 1, units[i]);
                    for(let link of links){
                        if(misplacedUnit.isInLink(link)){
                            if(link[0][0] == misplacedUnit.territoryName && link[0][1] == misplacedUnit.unitIndex){
                                link[0][1] = i;
                            }
                            if(link[1][0] == misplacedUnit.territoryName && link[1][1] == misplacedUnit.unitIndex){
                                link[1][1] = i;
                            }
                        }
                    }
                }
            }
        }
    }
    /**Applies changes or adds territory
     * @param {Unit} territory - given as unit, unit values are null
     */
    applyTerritory(territory){
        if(this.mapData["TERRITORY"][territory.territoryName] == undefined || typeof(this.mapData["TERRITORY"][territory.territoryName]) != "object"){
            this.mapData["TERRITORY"][territory.territoryName] = territory.territory;
        }else{
            let storedTerritory = this.mapData["TERRITORY"][territory.territoryName]
            storedTerritory["NAME"] = territory.territoryName;
            if(territory.territory["MARKER"]){
                storedTerritory["MARKER"] = territory.territory["MARKER"];
            }else if(storedTerritory["MARKER"]){
                delete storedTerritory["MARKER"];
            }
            if(territory.territory["CONVOY"]){
                storedTerritory["CONVOY"] = territory.territory["CONVOY"];
            }else if(storedTerritory["CONVOY"]){
                delete storedTerritory["CONVOY"];
            }
        }
    }
    /**Remove territory if it exists
     * @param {Unit} territory - given as unit, unit values are null
     */
    rmTerritory(territory){
        delete this.mapData["TERRITORY"][territory.territoryName];
        let links = this.mapData["LINK"];
        for(let i = links.length - 1; i >= 0; --i){
            if(links[i][0][0] == territory.territoryName || links[i][1][0] == territory.territoryName){
                links.splice(i, 1);
            }
        }
    }
    applyCountries(count, countries){
        this.mapData["COUNTRY"][count.toString()] = countries;
    }
    rmCountries(count){
        delete this.mapData["COUNTRY"][count.toString()];
    }
}
export {Map, Unit};