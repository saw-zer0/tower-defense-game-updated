class Enemy extends Animatable {
    constructor(
        imageObject,
        x,
        y,
        width,
        height,
        dx = -1,
        dy = 0,
        floorHeight = Constants.FLOORHEIGHT,
        type = 'bigWolf'
    ) {
        super(imageObject, x, y, width, height, dx = -1, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.dead = false;
        this.hitPoint = 2;
        this.stuck;
        this.type = type;
        this.cryCount = 0;
        this.deadCount = 0;


    }

    update() {
        this.draw();
        this.move();
        this.gravity();


        if (this.checkFrame(9)) {
            this.changeFrame(this.imageObject.image);
        }
        this.increaseCounter();
        if (!this.stuck) {
            this.friction();
        }

        if (this.type === 'crying wolf') {
            this.cryCount++;
            if (this.cryCount > 50) {
                this.type = 'bigWolf';
                this.cryCount = 0;
            }
        }
    }

    gravity() {
        if (this.y + this.height > this.floorHeight) {
            this.dy = 0;
            this.vel.y = 0;
            this.y = this.floorHeight - this.height;
        } else {
            this.dy += this.accDueToGracity;
            this.vel.y = this.dy;
        }
    }

    friction() {
        if (this.dx > -1) {
            this.dx -= 2;
        } else {
            this.dx = -1;
        }
    }

    damage() {
        if (this.hitPoint > 0) {
            this.hitPoint--;
        } else {
            this.dead = true;
        }
        console.log('damage')
    }

}


class FlyingEnemy extends Enemy {
    constructor(
        imageObject,
        x,
        y,
        width,
        height,
        dx = -1,
        dy = 0,
        floorHeight = Constants.FLOORHEIGHT,
        type = 'drone'
    ) {
        super(imageObject, x, y, width, height, dx = -1, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.dead = false;
        this.hitPoint = 1;
        this.stuck;
        this.type = type;
    }

    update() {
        this.draw();
        this.move();

        if (!this.stuck) {
            this.friction();
        }

        if(this.y > this.floorHeight){
            this.dead = true;
        }

    }

}