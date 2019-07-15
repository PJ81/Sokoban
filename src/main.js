const PLAYING = 0, WINNING = 1;

let ctx = null, qw = 36, size = 20 * qw, level = null, t1 = 0, t2 = 0, timer = 0,
canvas = null, input = null,  state = PLAYING, mov = null, psh = null, cpy = null;

String.prototype.replaceAt = function(idx, rep) {
    return this.substr(0, idx) + rep+ this.substr(idx + rep.length);
}

function gameLoop(elp) {
    t2 = elp - t1; t1 = elp;
    level.showLevel();

    switch(state) {
        case PLAYING: doPlay(); break;
        case WINNING: doWinning(t2); break;
    }
    window.requestAnimationFrame(gameLoop);
}

function doPlay() {
    if(input.isPressed("up"))    level.move(0);
    if(input.isPressed("right")) level.move(1);
    if(input.isPressed("down"))  level.move(2);
    if(input.isPressed("left"))  level.move(3);
    if(input.isPressed("restart"))  level.loadLevel();
    if(input.isPressed("stepback"))  level.stepback();    

    if(level.isFinished()) {
        state = WINNING;
        timer = 0;
    }
}

function doWinning(elp) {
    timer += elp;
    if(timer > 3000) {
        level.nextLevel();
        state = PLAYING;
    }
}

function init() {
    canvas = document.createElement("canvas");
    canvas.id = "cv";
    ctx = canvas.getContext("2d");

    let b = document.getElementById("brd");
    mov = document.getElementById("moves");
    psh = document.getElementById("pushes");
    cpy = document.getElementById("copy");

    b.appendChild(canvas);

    input = new InputHandeler({  
        left: 37, up: 38, right: 39, down: 40,
        restart: 82, stepback: 90
    });

    level = new Level();

    state = PLAYING;

    window.requestAnimationFrame(gameLoop);
}