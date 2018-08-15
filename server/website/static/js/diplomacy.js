/**
 * Run all client side game logic
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/diplomacy
 */

canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineWidth = 10;
ctx.lineCap = "round";
ctx.lineTo(300, 100);
ctx.moveTo(300, 100);
ctx.lineTo(250, 150);
ctx.moveTo(300, 100);
ctx.lineTo(250, 50);
ctx.stroke();
/*ctx.lineCap = "butt";
ctx.moveTo(300, 100);
ctx.setLineDash([8, 4]);
ctx.lineTo(100, 200);
ctx.stroke();*/