
class Level {
    constructor() {
        let idx = localStorage.getItem('fatfrog_soko');
        if(idx != null) {
            this.index = parseInt(idx);
        } else {
            this.index = 0;
        }
        this.currentLvl = "";
        this.wid = this.hei = 0;
        this.px = this.py = 0;
        this.goals = this.mov = this.psh = 0;
        this.history = [];

        this.loadLevel();
    }

    nextLevel() {
        this.index++;
        localStorage.setItem('fatfrog_soko', this.index + '');
        this.loadLevel();
    }

    pushOrMove(dx, dy) {
        let oldP = this.px + this.wid * this.py,
            pos  = oldP + dx + dy * this.wid,
            c    = this.currentLvl[pos],
            lvl = this.currentLvl,
            m = this.mov, p = this.psh;

        if(c == '#') return;

        if(c == '$' || c == '*') {
            let gpos = pos + dx + dy * this.wid;
            c = this.currentLvl[gpos];
            if(c == ' ' || c == '.') {
                c = c == ' ' ? '$' : '*';
                this.currentLvl = this.currentLvl.replaceAt(gpos, c);
                this.psh++;
            } else  {
                return;
            }
        }
        c = this.currentLvl[pos];
        c = c == '.' || c == '*' ? '+' : '@';
        this.currentLvl = this.currentLvl.replaceAt(pos, c);
        c = this.currentLvl[oldP] == '@' ? ' ': '.';
        this.currentLvl = this.currentLvl.replaceAt(oldP, c);
        this.mov++;

        this.history.push({
            l:lvl, x:this.px, 
            y:this.py, p:p, m:m
        });
        if(this.history.length > 420) {
            this.history.splice(0, 1);
        }
        this.px += dx; this.py += dy;
    }

    isFinished() {
        let g = 0;
        for(let x = 0; x < this.currentLvl.length; x++) {
            let c = this.currentLvl[x];
            if(c == '*') g++;
        }
        return g == this.goals;
    }

    stepback() {
        if(this.history.length < 1) return;
        let h = this.history.pop();
        this.currentLvl = h.l;
        this.px = h.x;
        this.py = h.y;
        this.psh = h.p;
        this.mov = h.m;
    }

    loadLevel() {
        let str = levels[this.index];
        let idx = str.indexOf("%");
        let idx2 = str.indexOf("%", idx + 1);
        cpy.innerHTML = "Level created by: " + str.substr(0, idx);
        this.wid = parseInt(str.substr(idx + 1, idx2));
        [idx, idx2] = [idx2, idx];
        idx2 = str.indexOf("%", idx + 1);
        this.hei = parseInt(str.substr(idx + 1, idx2));
        [idx, idx2] = [idx2, idx];

        this.currentLvl = str.substr(idx + 1);
        this.goals = 0;
        for(let x = 0; x < this.currentLvl.length; x++) {
            let c = this.currentLvl[x];
            if(c == '+' || c == '*' || c == '.') this.goals++;
            if(c == '+' || c == '@') {
                this.px = x % this.wid; 
                this.py = Math.floor(x / this.wid);
            }
        }

        this.history = [];

        canvas.width = this.wid * qw;
        canvas.height = this.hei * qw;
        ctx.font = "30px Share Tech Mono";

        this.mov = this.psh = 0;
    }

    showLevel() {
        let f = true, uni = 0, a = 0, b = 0;
        for(let y = 0; y < this.hei; y++) {
            for(let x = 0; x < this.wid; x++) {
                let c = this.currentLvl[x + y * this.wid];
                switch(c) {
                    case "#":
                        ctx.fillStyle = f ? "#222" : "#333";
                        //uni = "\u2b1b";
                        //a = x * qw + qw / 7; b = y * qw + qw - qw / 5;
                    break;
                    case "*":
                        ctx.fillStyle = "#ac0800";
                        uni = "\u2BBD";
                        a = x * qw + qw / 8; b = y * qw + qw - qw / 5;
                    break;
                    case "$":
                        ctx.fillStyle = "#e64a19";
                        uni = "\u2B1C";
                        a = x * qw + qw / 7; b = y * qw + qw - qw / 5;
                    break;
                    case ".":
                        ctx.fillStyle = "#66bb6a";
                        uni = "\u2A2F";
                        a = x * qw + qw / 4.5; b = y * qw + qw - qw / 4;
                    break;
                    case "+":
                        ctx.fillStyle = "#03a9f4";
                        uni = "\u07d0";
                        a = x * qw + qw / 5; b = y * qw + qw - qw / 5;
                    break;
                    case "@":
                        ctx.fillStyle = "#29b6f6";
                        uni = "\u07C9";
                        a = x * qw + qw / 4; b = y * qw + qw - qw / 5;
                    break;
                    case " ":
                        ctx.fillStyle = f ? "#ccc" : "#ddd";
                        //uni = " ";
                    break;
                }
                f = !f;
                ctx.fillRect(x * qw, y * qw, qw, qw);
                ctx.fillStyle = "white";
                ctx.fillText(uni, a, b);
            }
            f = this.wid % 2 ? f : !f;
        }

        mov.innerHTML = "Moves: " + this.mov;
        psh.innerHTML = "Pushes: " + this.psh;
    }

    move(d) {
        switch(d) {
            case 0: this.pushOrMove( 0, -1); break;
            case 1: this.pushOrMove( 1,  0); break;
            case 2: this.pushOrMove( 0,  1); break;
            case 3: this.pushOrMove(-1,  0); break;
        }
    }
}