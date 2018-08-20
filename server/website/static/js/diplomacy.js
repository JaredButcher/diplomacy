/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/diplomacy
 */

import * as map from './map.js';
import {mapDraw} from '/mapDraw.js';

let gameMap = new map.map('/static/maps/defaultMap.json');

//Arrow draw test
let canvas = new map.mapDraw("gameCanvas");

gameMap.onload = function(){
    requestAnimationFrame(draw);
    console.log("load")
}

function draw(){
    canvas.ctx.save();
    canvas.ctx.setTransform(1,0,0,1,0,0);
    canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
    canvas.ctx.restore();

    canvas.ctx.drawImage(gameMap.img, 0, 0);
    canvas.drawLine('green', 50, 200, 150, 150);
    canvas.drawConvoyRoute('blue', false, 100, 100, 150, 150, 150, 400);
    canvas.drawConvoyRoute('green', true, 200, 450, 150, 400, 375, 350);
    canvas.drawArrow('red', true, 300, 300, 375, 350);
    canvas.drawArrow('orange', false, 300, 200, 300, 300);
    canvas.drawAttackSupport('orange', 400, 280, 300, 300, 300, 200);
    
    canvas.drawUnit('blue', false, 'F', 100, 100);
    canvas.drawUnit('green', false, 'A', 50, 200);
    canvas.drawUnit('green', false, 'F', 200, 450);
    canvas.drawUnit('red', false, 'A', 375, 350);
    canvas.drawUnit('red', true, 'A', 300, 300);
    canvas.drawUnit('orange', false, 'A', 400, 280);
    canvas.drawUnit('orange', false, 'A', 300, 200);
    
    canvas.drawX(100, 175);
    canvas.drawX(125, 125);
    canvas.drawX(175, 425);
    canvas.drawX(340, 325);
    requestAnimationFrame(draw);
}

let mouseDown = false;
document.getElementById('gameCanvas').onmousedown = function(evt){
    if(!mouseDown){
        console.log("X: " + evt.clientX + " Y: " + evt.clientY);
        mouseDown = true;
    }
}
document.getElementById('gameCanvas').onmouseup = function(evt){
    mouseDown = false;
}
