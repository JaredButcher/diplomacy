/**
 * Used for drawing map features
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/mapDraw
 */

class MapDraw{
    /**
     * Class for drawing arrows and other map elements 
     * @param {string} canvasId - html id for game canvas to write to 
     */
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    static ARROW_POINT_LENGTH() {return 15;}

    static ARROW_POINT_ANGLE() {return .5;}

    static CONVOY_SQUIGLES() {return 6;}

    static CONVOY_SQUIGLE_WIDTH() {return 20;}

    static LINE_WIDTH() {return 8;}

    static UNIT_SIZE() {return 20;}

    /**
     * Draws a solid arrow representing a move of a unit on canvas area
     * @param {string} color - parsed css color for line
     * @param {bool} isSupport - makes line dotted for use in supporting holds
     * @param {int} sX - source x
     * @param {int} sY - source y
     * @param {int} dX - destination x
     * @param {int} dY - destination y
     */
    drawArrow(color, isSupport, sX, sY, dX, dY){
        this.ctx.beginPath();
        this.ctx.lineWidth = MapDraw.LINE_WIDTH();
        this.ctx.strokeStyle = color;
        if(isSupport){
            this.ctx.lineCap = "butt";
            this.ctx.setLineDash([6, 2]);
        }
        this.ctx.moveTo(sX, sY);
        let angle = Math.atan2(dY-sY, dX-sX);
        dX -= Math.cos(angle) * MapDraw.UNIT_SIZE() * .6;
        dY -= Math.sin(angle) * MapDraw.UNIT_SIZE() * .6;
        this.ctx.lineTo(dX, dY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.moveTo(dX,dY);
        this.ctx.lineTo(dX - Math.cos(angle + MapDraw.ARROW_POINT_ANGLE())*MapDraw.ARROW_POINT_LENGTH(), dY - Math.sin(angle + MapDraw.ARROW_POINT_ANGLE())*MapDraw.ARROW_POINT_LENGTH());
        this.ctx.moveTo(dX,dY);
        this.ctx.lineTo(dX - Math.cos(angle - MapDraw.ARROW_POINT_ANGLE())*MapDraw.ARROW_POINT_LENGTH(), dY - Math.sin(angle - MapDraw.ARROW_POINT_ANGLE())*MapDraw.ARROW_POINT_LENGTH());
        this.ctx.stroke();
    }

    /**
     * Draws dashed line representing support
     * @param {string} color - parsed css color for line
     * @param {int} sX - source x
     * @param {int} sY - source y
     * @param {int} dX - supported move destination x
     * @param {int} dY - supported move destination y
     * @param {int} tX - supported move source y
     * @param {int} tY - supported move source x
     */
    drawAttackSupport(color, sX, sY, dX, dY, tX, tY){
        this.ctx.beginPath();
        this.ctx.lineWidth = MapDraw.LINE_WIDTH();
        this.ctx.lineCap = "butt";
        this.ctx.strokeStyle = color;
        this.ctx.setLineDash([6, 2]);
        this.ctx.moveTo(sX, sY);
        this.ctx.quadraticCurveTo(tX, tY, dX, dY);
        this.ctx.stroke();
    }

    /**
     * Draws a single part of a convoy route
     * @param {string} color - css color of lines
     * @param {bool} isFinal - put an arrow at the destination
     * @param {int} sX - fleet location x
     * @param {int} sY - fleet location y
     * @param {int} cX - desninated convoy point x
     * @param {int} cY - desinated convoy point y
     * @param {int} dX - destination x
     * @param {int} dY - destination y
     */
    drawConvoyRoute(color, isFinal, sX, sY, cX, cY, dX, dY){
        this.ctx.beginPath();
        this.ctx.lineWidth = MapDraw.LINE_WIDTH();
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(sX, sY);
        let angle = Math.atan2(cY-sY, cX-sX) + Math.PI/2; //Find normal angle
        let stepX = (cX-sX)/MapDraw.CONVOY_SQUIGLES();
        let stepY = (cY-sY)/MapDraw.CONVOY_SQUIGLES();
        let offsetX = Math.cos(angle)*MapDraw.CONVOY_SQUIGLE_WIDTH();
        let offsetY = Math.sin(angle)*MapDraw.CONVOY_SQUIGLE_WIDTH();
        for(let i = 0; i < MapDraw.CONVOY_SQUIGLES(); ++i){
            let direction = (i % 2 == 0) ? 1 : -1;
            this.ctx.quadraticCurveTo(stepX * (i + .5) + sX + offsetX * direction, stepY * (i + .5) + sY + offsetY * direction, stepX*(i+1) + sX, stepY*(i+1) + sY);
        }
        this.ctx.stroke();
        this.drawDot(color, cX, cY, this.UNIT_SIZE / 2);
        if(dX != null){
            (isFinal) ? this.drawArrow(color, false, cX, cY, dX, dY) : this.drawLine(color, cX, cY, dX, dY);
        }
    }

    /**
     * Draws a line
     * @param {string} color - color of line
     * @param {int} sX - source x
     * @param {int} sY - source y
     * @param {int} dX - destination x
     * @param {int} dY - destination y
     */
    drawLine(color, sX, sY, dX, dY){
        this.ctx.beginPath();
        this.ctx.lineWidth = MapDraw.LINE_WIDTH();
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(sX, sY);
        this.ctx.lineTo(dX, dY);
        this.ctx.stroke();
    }
    /**
     * Draws a circle
     * @param {string} color - css color 
     * @param {int} x
     * @param {int} y
     * @param {int} size - size of dot
     */
    drawDot(color, x, y, size=MapDraw.UNIT_SIZE()){
        this.ctx.beginPath();
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = size;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x, y);
        this.ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }

    /**
     * Draws a unit
     * @param {string} color - css color 
     * @param {string} type - Letter displayed on unit, should be A or F
     * @param {int} x
     * @param {int} y
     * @param {bool} isDisloged - is unit currently disloged, draws black border
     * @param {bool} isSelected - is unit selected, shades unit
     */
    drawUnit(color, type, x, y, isDisloged=false, isSelected=false){
        this.ctx.lineCap = "round";
        if(isDisloged){
            this.drawDot('black', x, y, MapDraw.UNIT_SIZE() + 10);
        }
        let size = isSelected ? MapDraw.UNIT_SIZE() + 6 : MapDraw.UNIT_SIZE() ;
        this.drawDot(color, x, y, size);
        this.ctx.font = (size * .75) + 'px Arial Black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillText(type, x - size / 4, y + size / 4);
    }

    /**
     * Places an x on given location
     * @param {int} x 
     * @param {int} y 
     */
    drawX(x, y){
        this.ctx.beginPath();
        this.ctx.lineWidth = MapDraw.LINE_WIDTH() * .75;
        this.ctx.strokeStyle = 'black';
        this.ctx.moveTo(x - MapDraw.LINE_WIDTH(), y - MapDraw.LINE_WIDTH());
        this.ctx.lineTo(x + MapDraw.LINE_WIDTH(), y + MapDraw.LINE_WIDTH());
        this.ctx.moveTo(x + MapDraw.LINE_WIDTH(), y - MapDraw.LINE_WIDTH());
        this.ctx.lineTo(x - MapDraw.LINE_WIDTH(), y + MapDraw.LINE_WIDTH());
        this.ctx.stroke();
    }

    clear(){
        this.ctx.save();
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

}

export {MapDraw};