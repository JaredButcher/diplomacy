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
"BORDER"
"COAST"
*/

class Map{
    /**
     * Create and manage game map
     * @param {string | object} mapData - url to json file containing map infomation or object containing map data
     * @param {string} canvas - id of canvas to draw map on
     * @param {bool} editorMode - will dispaly all connections and positions
     */
    constructor(mapData, canvas, editorMode=false){
        this.editorMode = editorMode;
        this.draw = new MapDraw(canvas);
        if(typeof(mapData) == "string"){
            var self = this;
            let req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    self.mapData = JSON.parse(this.responseText);
                    this.onload = 
                    self.img = new Image();
                    self.img.src = self.mapData.IMG;
                    self.img.onload = () => { self.drawMap() };
                }
            }
            req.open("GET", mapData, true);
            req.send();
        }else if(typeof(mapData) == "object"){
            this.mapData = mapData;
            this.img = new Image();
            this.img.src = this.mapData.IMG;
            this.img.onload = () => { this.drawMap() };
        }else{
            console.error("invalid type passed to Map")
        }
    }
    /**
     * Draw map
     */
    drawMap(){
        this.draw.ctx.drawImage(this.img, 0, 0);
        for(let [territoryName, territory] of Object.entries(this.mapData["TERRITORY"])){
            if(territory["MARKER"]){
                this.draw.drawDot('black', territory.MARKER.X, territory.MARKER.Y)
            }
            if (this.editorMode && territory.UNIT){
                for(let [key, unit] of Object.entries(territory.UNIT)){
                    this.draw.drawUnit('gray', false, unit.TYPE[0], unit.X, unit.Y)
                    for(let [key, border] of Object.entries(unit.BORDER)){
                        let borderTerritory = this.mapData.TERRITORY[border];
                        if (borderTerritory && borderTerritory.UNIT){
                            for(let [key, borderUnit] of Object.entries(borderTerritory.UNIT)){
                                if(borderUnit.TYPE == unit.TYPE){
                                    for(let [key, borderTerritoryTerritory] of Object.entries(borderUnit.BORDER)){
                                        if(borderTerritoryTerritory == territoryName){
                                            this.draw.drawLine('gray', unit.X, unit.Y, borderUnit.X, borderUnit.Y)
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
export {Map};