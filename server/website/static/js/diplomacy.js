/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/diplomacy
 */

import { mapDraw } from './map.js';


//Arrow draw test
let map = new mapDraw("gameCanvas");

map.drawLine('green', 50, 200, 150, 150);
map.drawConvoyRoute('blue', false, 100, 100, 150, 150, 150, 400);
map.drawConvoyRoute('green', true, 200, 450, 150, 400, 375, 350);
map.drawArrow('red', true, 300, 300, 375, 350);
map.drawArrow('orange', false, 300, 200, 300, 300);
map.drawAttackSupport('orange', 400, 280, 300, 300, 300, 200);

map.drawUnit('blue', false, 'F', 100, 100);
map.drawUnit('green', false, 'A', 50, 200);
map.drawUnit('green', false, 'F', 200, 450);
map.drawUnit('red', false, 'A', 375, 350);
map.drawUnit('red', true, 'A', 300, 300);
map.drawUnit('orange', false, 'A', 400, 280);
map.drawUnit('orange', false, 'A', 300, 200);

map.drawX(100, 175);
map.drawX(125, 125);
map.drawX(175, 425);
map.drawX(340, 325);
