(function () {
    'use strict';
    /*global CanvasRenderingContext2D */
    /*jslint browser: true */
    var lastPostion = [0, 0];

    CanvasRenderingContext2D.prototype.process = function drawProcess(x, y, w, h) {
        this.rect(x, y, w, h);
        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.oval = function drawOval(x, y, w, h, start, end) {
        var i, xPos, yPos, firstPoint = true;
        end = end || 2 * Math.PI;
        start = start || 0.05;

        for (i = start; i < end; i += 0.05) {
            xPos = (x + w / 2) - (w / 2 * Math.cos(i));
            yPos = (y + h / 2) + (h / 2 * Math.sin(i));

            if (firstPoint) {
                this.moveTo(xPos, yPos);
                firstPoint = false;
            } else {
                this.lineTo(xPos, yPos);
            }
        }
        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.db = function drawCylinder(x, y, w, h) {
        this.oval(x, y, w, h / 4);
        this.oval(x, y + h * 0.75, w, h / 4, 0, Math.PI);

        this.moveTo(x, y + h / 8);
        this.lineTo(x, y + h - h / 8);

        this.moveTo(x + w, y + h / 8);
        this.lineTo(x + w, y + h - h / 8);

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.drive = function drawSidewaysCylinder(x, y, w, h) {
        this.oval(x, y, h / 2, h, Math.PI * 1.5, Math.PI * 2.5);
        this.oval(x + w - h / 2, y, h / 2, h);

        this.moveTo(x + h / 4, y);
        this.lineTo(x + w - h / 4, y);

        this.moveTo(x + h / 4, y + h);
        this.lineTo(x + w - h / 4, y + h);

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.display = function drawDisplay(x, y, w, h) {
        this.oval(x + w - h / 2, y, h / 2, h, Math.PI * 0.5, Math.PI * 1.5);

        this.moveTo(x + w - h / 4, y);
        this.lineTo(x + h / 4, y);
        this.lineTo(x, y + h / 2);
        this.lineTo(x + h / 4, y + h);
        this.lineTo(x + w - h / 4, y + h);

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.storage = function drawStorage(x, y, w, h) {
        this.moveTo(x + h / 2, y + h);
        this.arc(x + h / 2, y + h / 2, h / 2, Math.PI * 0.5, Math.PI * 1.5, false);
        this.lineTo(x + w, y);
        this.arc(x + w, y + h / 2, h / 2, Math.PI * 1.5, Math.PI * 0.5, true);
        this.closePath();

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.terminator = function drawTerminator(x, y, w, h) {
        this.moveTo(x + h / 2, y + h);
        this.arc(x + h / 2, y + h / 2, h / 2, Math.PI * 0.5, Math.PI * 1.5, false);
        this.arc(x + w - h / 2, y + h / 2, h / 2, Math.PI * 1.5, Math.PI * 0.5, false);
        this.closePath();

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.cloud = function drawCloud(x, y) { //, w, h
        /*this.moveTo(x + h / 2, y + h);
        this.arc(x + h / 2, y + h / 2, h / 2, Math.PI * 0.5, Math.PI * 1.6, false);
        this.moveTo(x + w * 0.13, y + h * 0.15);
        this.arc(x + w * 0.21, y + h * 0.14, h / 3, Math.PI, Math.PI * 1.8, false);
        this.moveTo(x + w * 0.252, y);
        this.arc(x + w * 0.5, y + h * 1.5, w * 0.4, Math.PI * 1.3, Math.PI * 1.7, false);
        this.moveTo(x + w - h / 2, y);
        this.arc(x + w - h / 2, y + h / 2, h / 2, Math.PI * 1.5, Math.PI * 0.5, false);
        this.closePath();*/

        //this.moveTo(170, 80);
        this.moveTo(x, y);
        //this.bezierCurveTo(130, 100, 130, 150, 230, 150);
        this.bezierCurveTo(x * 0.765, y * 1.25, x * 0.765, y * 0.882, x * 1.35, y * 0.882);
        //this.bezierCurveTo(250, 180, 320, 180, 340, 150);
        this.bezierCurveTo(250, 180, 320, 180, 340, y * 0.882);
        this.bezierCurveTo(420, 150, 420, 120, 390, 100);
        this.bezierCurveTo(430, 40, 370, 30, 340, 50);
        this.bezierCurveTo(320, 5, 250, 20, 250, 50);
        this.bezierCurveTo(250, 30, 160, 20, 170, 80);
        this.closePath();

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.decision = function drawDiamond(x, y, w, h) {
        this.moveTo(x, y + h / 2);
        this.lineTo(x + w / 2, y);
        this.lineTo(x + w, y + h / 2);
        this.lineTo(x + w / 2, y + h);
        this.closePath();

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.io = function drawParallelogram(x, y, w, h) {
        // This is a poor hack that needs to be done with a standard (or defined in the function argument) angle
        this.moveTo(x + w * 0.1, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w * 0.9, y + h);
        this.lineTo(x, y + h);
        this.closePath();

        lastPostion = [x, y];
    };

    CanvasRenderingContext2D.prototype.arrow = function drawArrow(startX, startY, stopX, stopY) {
        var rightAngle = Math.PI / 2,
            // I do not fully understand this trig but it seems to work.
            angle = Math.atan2(startY - stopY, stopX - startX) - rightAngle,
            arrowSize = 5,
            stopX2 = stopX + 5 * Math.sin(angle),
            stopY2 = stopY + 5 * Math.cos(angle),
            stopXDiff = arrowSize / 2 * Math.sin(angle - rightAngle),
            stopYDiff = arrowSize / 2 * Math.cos(angle - rightAngle);

        // line
        this.moveTo(startX, startY);
        this.lineTo(stopX2, stopY2);

        // pointer
        this.lineTo(stopX2 + stopXDiff, stopY2 + stopYDiff);
        this.lineTo(stopX, stopY);
        this.lineTo(stopX2 - stopXDiff, stopY2 - stopYDiff);
        this.lineTo(stopX2, stopY2);
    };

    CanvasRenderingContext2D.prototype.relText = function drawRelText(text, x, y) {
        this.fillText(text, x + lastPostion[0], y + lastPostion[1]);
    };
}());

function diagramBehavior(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '18px sans-serif';

    ctx.beginPath();

    ctx.fillText("Behavior", 160, 180);
    ctx.font = '16px sans-serif';
    ctx.fillText("Conditions", 30, 150);
    ctx.fillText("Thing", 170, 150);
    ctx.fillText("Actions", 300, 150);
    ctx.closePath();

    //ctx.moveTo(70, 35);
    ctx.arc(70, 35, 25, 0, 2 * Math.PI, false);
    ctx.moveTo(95, 95);
    ctx.arc(70, 95, 25, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.arc(45, 65, 25, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(150.5, 30.5, 80, 80);

    ctx.rect(280.5, 30.5, 90, 25);
    ctx.rect(280.5, 80.5, 90, 25);

    ctx.arrow(95.5, 35.5, 150.5, 45.5);
    ctx.arrow(70.5, 65.5, 150.5, 65.5);
    ctx.arrow(95.5, 95.5, 150.5, 90.5);

    ctx.arrow(230.5, 55.5, 280.5, 41.5);
    ctx.arrow(230.5, 85.5, 280.5, 94.5);

    ctx.stroke();
}

function diagramBL(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '18px sans-serif';

    ctx.beginPath();

    ctx.fillText("Behavioral", 160, 65);
    ctx.fillText("Logic", 180, 90);
    ctx.font = '16px sans-serif';
    ctx.fillText("Conditions", 30, 150);
    ctx.fillText("Thing", 170, 150);
    ctx.fillText("Actions", 325, 150);
    ctx.closePath();

    ctx.arc(70, 35, 25, 0, 2 * Math.PI, false);
    ctx.moveTo(95, 95);
    ctx.arc(70, 95, 25, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.arc(45, 65, 25, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(130.5, 30.5, 140, 80);
    ctx.rect(150.5, 40.5, 100, 60);

    ctx.rect(315.5, 30.5, 70, 25);
    ctx.rect(315.5, 80.5, 70, 25);

    ctx.arrow(95.5, 35.5, 130.5, 62);
    ctx.arrow(70.5, 65.5, 130.5, 65.5);
    ctx.arrow(95.5, 95.5, 130.5, 69.5);

    ctx.arrow(270.5, 70.5, 315.5, 41.5);
    ctx.arrow(270.5, 70.5, 315.5, 94.5);

    ctx.arrow(130.5, 65.5, 150.5, 65.5);
    ctx.arrow(250.5, 70.5, 270.5, 70.5);

    ctx.stroke();
}

function diagramImagine(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '16px sans-serif';

    ctx.beginPath();

    ctx.rect(20.5, 10.5, 90, 35);
    ctx.fillText("Situation", 35, 34);
    ctx.arrow(60.5, 45.5, 80.5, 65.5);

    ctx.rect(120.5, 10.5, 60, 35);
    ctx.fillText("Idea", 135, 34);
    ctx.arrow(150.5, 45.5, 120.5, 65.5);

    ctx.drive(25.5, 65.5, 140, 42);
    ctx.fillText("Beliefs", 65, 92);
    ctx.arrow(90.5, 107.5, 90.5, 127.5);

    ctx.rect(35.5, 128.5, 120, 35);
    ctx.fillText("Prediction", 60, 152);
    ctx.arrow(90.5, 164.5, 90.5, 184.5);

    ctx.drive(25.5, 184.5, 140, 42);
    ctx.fillText("Opinions", 60, 213);
    ctx.arrow(90.5, 226.5, 90.5, 246.5);

    ctx.rect(20.5, 247.5, 150, 35);
    ctx.fillText("Judgment", 60, 270);
    //ctx.fillText("Feelings", 38, 157);

    ctx.stroke();
}


function diagramDecide(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '16px sans-serif';

    ctx.beginPath();

    //ctx.terminator(10.5, 10.5, 120, 30);
    //ctx.fillText("Scenario", 35, 32);
    //ctx.arrow(70.5, 40.5, 70.5, 60.5);

    ctx.rect(180.5, 10.5, 120, 30);
    ctx.fillText("(New) Idea", 200, 31);
    ctx.arrow(180.5, 25.5, 130.5, 25.5);

    ctx.rect(10.5, 10.5, 120, 30);
    ctx.fillText("Thought", 40, 31);
    ctx.arrow(70.5, 40.5, 70.5, 60.5);

    ctx.decision(10.5, 60.5, 120, 60);
    ctx.fillText("Decision", 40, 95);
    ctx.arrow(70.5, 120.5, 70.5, 150.5);
    ctx.fillText("yes", 80, 140);

    ctx.moveTo(130.5, 90.5);
    ctx.lineTo(230.5, 90.5);
    ctx.fillText("no", 145, 81);
    ctx.arrow(230.5, 90.5, 230.5, 41.5);

    ctx.rect(10.5, 151.5, 120, 30);
    ctx.fillText("Act", 55, 172);

    ctx.stroke();
}

function diagramGraph1(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '16px sans-serif';

    ctx.beginPath();

    ctx.moveTo(40.5, 20.5);
    ctx.lineTo(40.5, 100.5);
    ctx.lineTo(250.5, 100.5);

    ctx.fillText('P()', 10, 65);
    ctx.fillText('0', 35, 120);
    ctx.fillText('1.0', 130, 120);
    ctx.fillText('2.0', 230, 120);

    ctx.moveTo(40, 100);
    //ctx.quadraticCurveTo(150, 0, 240, 100);
    ctx.bezierCurveTo(50, 30, 230, 30, 240, 100);

    ctx.fillText('Movement speed', 80, 140);

    ctx.stroke();
}

function diagramGraph2(id) {
    "use strict";

    var canvas = document.getElementById(id),
        ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.font = '16px sans-serif';

    ctx.beginPath();

    ctx.moveTo(40.5, 20.5);
    ctx.lineTo(40.5, 100.5);
    ctx.lineTo(250.5, 100.5);

    ctx.fillText('P()', 10, 65);
    ctx.fillText('0', 35, 120);
    ctx.fillText('1.0', 130, 120);
    ctx.fillText('2.0', 230, 120);

    ctx.moveTo(40, 100);
    ctx.quadraticCurveTo(120, 100, 140, 60);
    ctx.quadraticCurveTo(170, 0, 200, 70);
    ctx.quadraticCurveTo(210, 100, 240, 100);
    //ctx.bezierCurveTo(50, 30, 230, 30, 240, 100);

    ctx.fillText('Movement speed', 80, 140);

    ctx.stroke();
}

function replaceWithCanvas(id, funcDiagram, width, height) {
    'use strict';
    var elPre = document.getElementById(id),
        diagramCanvas = document.createElement('canvas');

    if (!elPre) {
        //console.log(id + ' not found');
        return;
    }
    diagramCanvas.setAttribute('height', height);
    diagramCanvas.setAttribute('width', width);
    diagramCanvas.id = id + 'Replaced';

    elPre.parentNode.replaceChild(diagramCanvas, elPre);
    funcDiagram(id + 'Replaced');
}

replaceWithCanvas('behaviorDiagram', diagramBehavior, 390, 190);
replaceWithCanvas('blDiagram', diagramBL, 400, 165);
replaceWithCanvas('imagineDiagram', diagramImagine, 200, 295);
replaceWithCanvas('decideDiagram', diagramDecide, 330, 190);

replaceWithCanvas('graph1Diagram', diagramGraph1, 270, 155);
replaceWithCanvas('graph2Diagram', diagramGraph2, 270, 155);
