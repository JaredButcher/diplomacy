/**
 * Used for map interactins
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/map
 */

import * as PROTOCOL from "./protocol.js";
import {wsClient} from "./wsClient.js";
import {mapDraw} from "./mapDraw.js";

class map{
    /**
     * Create and manage game map
     * @param {string} mapUrl - url to json file containing map infomation 
     */
    constructor(mapUrl){
        var self = this;
        this.onload = function(){self.drawMap();}
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                self.mapData = JSON.parse(this.responseText);
                self.img = new Image();
                self.img.src = self.mapData.IMG;
                self.img.onload = self.onload;
            }
        }
        req.open("GET", "/static/maps/defaultMap.json", true);
        req.send();
        this.draw = new mapDraw("gameCanvas");
    }
    /**
     * Draw map
     */
    drawMap(){
        this.draw.ctx.drawImage(this.img, 0, 0);
        Object.keys(this.mapData.TERRITORY).forEach(key => {
            if(this.mapData.TERRITORY[key]["MARKER"]){
                this.draw.drawDot('black', this.mapData.TERRITORY[key].MARKER.X, this.mapData.TERRITORY[key].MARKER.Y)
                console.log("X: " + this.mapData.TERRITORY[key].MARKER.X + " Y: " + this.mapData.TERRITORY[key].MARKER.Y)
                console.log(typeof(this.mapData.TERRITORY[key].MARKER.X))
            }
        });
    }
}
export {map};