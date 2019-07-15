
class InputHandeler {
    constructor(c) {
        this.keys = {};
        this.down = {};
        this.pressed = {};
        for (let key in c) {
            let b = c[key];
            this.keys[b] = key;
            this.down[key] = false;
            this.pressed[key] = false
        }
        let a = this;
        document.addEventListener("keydown", function(d) {
            if (a.keys[d.keyCode]) {
                a.down[a.keys[d.keyCode]] = true
            }
            let f = d ? d : window.event;
            f.returnValue = false;
            return false
        });
        document.addEventListener("keyup", function(d) {
            if (a.keys[d.keyCode]) {
                a.down[a.keys[d.keyCode]] = false;
                a.pressed[a.keys[d.keyCode]] = false
            }
            let f = d ? d : window.event;
            f.returnValue = false;
            return false
        })
    }

    isDown(a) {
        return this.down[a]
    }

    isPressed(a) {
        if (this.pressed[a]) {
            return false
        } else {
            if (this.down[a]) {
                this.pressed[a] = true;
                return true;
            }
        }
        return false
    }
}