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
        super(imageObject, x, y, imageObject.width, imageObject.height, dx, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.dead = false;
        this.hitPoint = 2;
        this.stuck;
        this.type = type;
        this.cryCount = 0;
        this.deadCount = 0;
        this.frameSpeed = 9;
    }

    update() {
        this.draw();
        this.move();
        this.gravity();


        if (this.checkFrame(this.frameSpeed)) {
            this.changeFrame(this.imageObject.image);

        }
        this.increaseCounter();

        if (!this.stuck) {
            this.friction();
        }

        if (this.type === 'crying wolf') {
            this.cryCount++;
            if (this.cryCount > 40) {
                this.type = 'bigWolf';
                this.cryCount = 0;
            }
        }

        if (this.x < 490 && this.type !== 'drone' && this.type !== 'dead wolf') {
            this.type = 'attacking wolf'
        }

        if (this.type === 'dead wolf') {
            this.damage();
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
            this.dx = 0;
            this.frameSpeed = 8;
            this.type = 'dead wolf';
            this.deadCount++;
            if(this.deadCount >= imagePosition["dead wolf"].length - 1 && this.timeout === undefined){
                setTimeout(()=>{
                    this.dead = true;
                }, 625);
            }
        }
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

        if (this.y > this.floorHeight) {
            
            this.dead = true;
        }

    }


}

class Blocks extends Animatable{
    constructor(imageObject, x, y, width, height, dx = 0, dy = 0, floorHeight){
        super(imageObject, x, y, width, height, dx = 0, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.bounce = 0.6;

    }

    update(){
        this.draw();
        this.move();
    }

    friction() {
        if (this.dx > 0) {
            this.dx -= 1;
        } else if(this.dx < 0){
            this.dx += 1;
        }else{
            this.dx = 0;
        }
    }

    gravity(){
        if(this.y + this.height >= this.floorHeight){
            this.y = this.floorHeight - this.height;
            this.dy = -(this.dy * this.bounce);
        }
        this.dy += this.accDueToGracity;
    }

}

class Boss extends Enemy{
    constructor(
        imageObject,
        x,
        y,
        width,
        height,
        dx = -5,
        dy = 0,
        floorHeight = Constants.FLOORHEIGHT,
        type = 'boss run'
    ) {
        super(imageObject, x, y, imageObject.width, imageObject.height, dx, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.dead = false;
        this.hitPoint = 2;
        this.stuck;
        this.type = type;
        this.punchCount = 0;
        this.imagePositionIndex = 0;
        this.frameSpeed = 4;
        this.noOfShot = Math.floor(getRandom(1, 4));
    }

    update() {
        this.draw();
        this.move();
        this.gravity();
        this.friction();

        if(this.x <= 750){
            this.dx = 0;
            this.type = 'boss attack';
            this.frameSpeed = 6;

        }

        if(this.type === 'boss attack' && this.noOfShot == 0){
            this.noOfShot = Math.floor(getRandom(1,5));
            this.noOfShot;
        }


        if (this.checkFrame(this.frameSpeed)) {
            this.changeFrame(this.imageObject.image);
            this.imagePositionIndex = (this.imagePositionIndex >= imagePosition['boss attack'].length - 1 ) ? 0 : this.imagePositionIndex+1;
        }
        this.increaseCounter();
    }


    
    friction() {
        if (this.dx > -5) {
            this.dx -= 3;
        } else {
            this.dx = -5;
        }
    }

    relocate(x, y){
        this.x = x;
        this.y = y;
    }
}

class BossProjectile extends Animatable{
    constructor(
        imageObject,
        x,
        y,
        width,
        height,
        dx = -12,
        dy = 0,
        floorHeight = Constants.FLOORHEIGHT,
        type = 'boss projectile'
    ) {
        super(imageObject, x, y, imageObject.width, imageObject.height, dx, dy = 0, floorHeight = Constants.FLOORHEIGHT);
        this.hit = false;
        this.frameSpeed = 3;
        this.type = type;
    }

    update(){
        this.draw();
        this.move();

        if (this.checkFrame(this.frameSpeed)) {
            this.changeFrame(this.imageObject.image);

        }
        this.increaseCounter();

    }

}