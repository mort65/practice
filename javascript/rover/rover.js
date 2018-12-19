/*
Mars Rover

A rover is a space exploration vehicle designed to move across the surface of a planet or other celestial body. Some rovers are partially or fully autonomous robots.

Rovers are very useful for exploring the universe; they are created to land another planet to find out information and to take samples. They can collect dust, rocks, and take pictures.
Simulate and visualize an autonomous rover by implementing its
 CPM (Command Processing Module). The CPM allows to control the rover remotely. 

Rover Commands
MOV Moves the rover forward (F) or backward (B) by a specified number of steps. For example, the command "MOV F 3" moves the rover forward by 3 steps.

TRN Turns the rover left (L) or right (R) by 15 degrees. For example, the command "TRN L" turns the rover left by 15 degrees. To turn the rover by 90 degrees left, the "TRN L" command should be executed six times.

RCK Collects rocks for analysis. The rover has a container for the rocks with a limited space and can collect no more than five rocks.

RLS Releases the last collected rock from the container. Executing this command five times makes the rover clean its container for rocks. 

ANL Performs a chemical analysis on the last collected rock.

PIC Takes a picture of the area. The rover can save up to ten photos. 

LOG Prints the list of the commands executed recently.

Create a program that visualizes the rover on the surface and provides an interface to type commands. Each typed command is then executed by the rover. 
Submit your creations in the comments section below!
*/

window.onload = function () {
    const cvs = document.querySelector('canvas');
    const ctx = cvs.getContext('2d');
    var cmdButton = document.getElementById('cmd_button');
    var cmdInput = document.getElementById('cmd_text');
    var infoTextArea = document.getElementById('info_textarea');
    const BG_COLOR = 'burlywood';
    const ELEMENTS = ['hydrogen','iron','nitrogen','carbon'];
    var cmdHistory = [];
    const rover = {
        posX : 20,
        posY: 20,
        angle: 45 / 180 * Math.PI,
        width: 30,
        height: 30,
        capacity:5,
        stones: [],
        pics: 0,
        max_pics: 10,
        move: function (direction, distance) {
            if (direction === 'F') {
                this.posX += Math.cos(this.angle) * distance;
                this.posY += Math.sin(this.angle) * distance; 
            } 
            else if (direction === 'B') {
                this.posX -= Math.cos(this.angle) * distance;
                this.posY -= Math.sin(this.angle) * distance;
            }
        },
        turn: function (direction) {
            if (direction === 'L') {
                this.angle -= (15 / 180 * Math.PI)
            }
            else if (direction === 'R') {
                this.angle += (15 / 180 * Math.PI)                
            }
        },
        collect: function() {
            if (this.stones.length < this.capacity) {
                this.stones.push('RCK' + (this.stones.length + 1));
                return true;
            }
            return false;
        },
        release: function() {
            if (this.stones.length > 0) {
                var stone = this.stones[this.stones.length - 1];
                this.stones.pop(); 
                return stone + ' Released.';
            }
            return 'Rover Doesn\'t Carry Any Stones.';
        },
        analyse: function() {
            if (this.stones.length > 0) {
                return (this.stones[this.stones.length - 1] + ' Analysed.');
            } else return 'Rover Doesn\'t Carry Any Stones.';
        },
        takePicture: function() {
            if (this.pics < this.max_pics) {
                this.pics += 1;
                return 'Picture Saved.'
            } else return 'Rover Can\'t Save Any More Pictures.';
        }
    };

    function drawRect(_x, _y, _w, _h, _color) {
        ctx.fillStyle = _color;
        ctx.fillRect(_x, _y, _w, _h);
    }

    function drawCircle(_x, _y, _r, _color) {
        ctx.fillStyle = _color;
        ctx.beginPath();
        ctx.arc(_x, _y, _r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    function drawText(_text, _font, _x, _y, _color) {
        ctx.font = _font;
        ctx.fillStyle = _color;
        ctx.fillText(_text, _x, _y);
    }

    function drawInfo() {  
        drawText('RCK ' + rover.stones.length + '/' + rover.capacity,'14px sans-serif', cvs.width - 70, 20, 'magenta');
        drawText('PIC ' + rover.pics + '/' + rover.max_pics,'14px sans-serif', cvs.width - 70, 40, 'magenta');
    }

    function drawRover() {
        var cx = rover.posX + (rover.width / 2);
        var cy = rover.posY + (rover.height / 2);
        var x = rover.posX - cx;
        var y = rover.posY - cy;
        var w = rover.width;
        var h = rover.height;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rover.angle);
        drawRect(x,y,w,h,'blue');
        drawRect(x - (w / 3), y + h, (2 / 3) * w,(1 / 6) * h, 'black');
        drawRect(x + w - (w / 3), y + h, (2 / 3) * w, (1/6) * h, 'black');
        drawRect(x - ( w / 3 ), y - ( h / 6 ), (2 / 3) * w, (1 / 6) * h, 'black');
        drawRect(x + w - (w / 3), y - (h / 6), (2 / 3) * w, (1 / 6) * h, 'black');
        drawCircle(x + 2 * (w / 3), y + (h / 2), h / 8, 'yellow');
        ctx.restore();
    }
    function clearCanvas() {
        drawRect(0, 0, cvs.width, cvs.height, BG_COLOR); 
    }

    function collisionHandler() {
        if (rover.posY < 0) { //Top
            rover.posY = cvs.height - Math.abs(rover.posY % cvs.height);
        } 
        else if (rover.posY > cvs.height) { //Bottom
            rover.posY = Math.abs(rover.posY % cvs.height);
        }

        if (rover.posX < 0) { //Left
            rover.posX = cvs.width - Math.abs(rover.posX % cvs.width);
        }
        else if (rover.posX > cvs.width) { //Right
            rover.posX = Math.abs(rover.posX % cvs.width);         
        }
    }

    function draw() {
        collisionHandler();
        clearCanvas();
        drawRover();
        drawInfo();
    }

    document.addEventListener("keydown", keydownHandler);

    function keydownHandler(e) {
        if (e.keyCode === 13 && (document.activeElement === cmdInput || document.activeElement === cmdButton)) { //Enter
            cmdHandler();
        }
    }

    function cmdHandler() {
        var cmdText = cmdInput.value.toString().toUpperCase();
        if (!cmdText.match(/^\s*$/)) {
            var moveRegEx = /^\s*MOV\s+([FB])\s+(\d+)\s*$/;
            var turnRegEX = /^\s*TRN\s+([LR])\s*$/;
            var collectRegEX = /^\s*RCK\s*$/;
            var releaseRegEx = /^\s*RLS\s*$/;
            var analyseRegEx = /^\s*ANL\s*$/;
            var pictureRegEx = /^\s*PIC\s*$/;
            var logRegEx = /^\s*LOG\s*$/;
            var cmdMove = cmdText.match(moveRegEx);
            var cmdTurn = cmdText.match(turnRegEX);
            var cmdCollect = cmdText.match(collectRegEX);
            var cmdRelease = cmdText.match(releaseRegEx);
            var cmdAnalyse = cmdText.match(analyseRegEx);
            var cmdPicture = cmdText.match(pictureRegEx);
            var cmdLog = cmdText.match(logRegEx);
            var msg = '';
            if (cmdMove) {
                rover.move(cmdMove[1], cmdMove[2])
                cmdHistory.push(cmdText);
                draw();
                msg = 'Rover\'s coordinates : [' + rover.posX + ', ' + rover.posY + ']';
            }
            else if (cmdTurn) {
                rover.turn(cmdTurn[1]);
                cmdHistory.push(cmdText);
                draw();
                msg = 'Rover\'s angle in radians: ' + rover.angle;
            }
            else if (cmdCollect) {
                if (rover.collect()) {
                    msg = 'Stone Collected.';
                }
                else {
                    msg = 'Not Enough Space.';
                }
                msg += '\nCollected Stones : ' + rover.stones.length;
                cmdHistory.push(cmdText);
                draw()
            }
            else if (cmdRelease) {
                msg = rover.release();
                msg += '\nCollected Stones : ' + rover.stones.length;
                cmdHistory.push(cmdText); 
                draw();
            }
            else if (cmdAnalyse) {
                msg = rover.analyse();
                draw();
                cmdHistory.push(cmdText);
            }
            else if (cmdPicture) {
                msg = rover.takePicture();
                msg += '\nSaved Pictures : ' + rover.pics;
                cmdHistory.push(cmdText); 
                draw();
            } else if (cmdLog) {
                for (var i = 0; i < cmdHistory.length; i++) {
                    msg += (i + 1) + ' ' + cmdHistory[i] + '\n';
                }
            } 
            else msg = 'Unknown Command \n\'' + cmdText+ '\'';
        }
        if (msg) {
            //console.log(msg);
            infoTextArea.innerHTML = '\n' + msg;
        }
    }

    draw();

    cmdButton.onclick = function() {
        cmdHandler();
    }
}
