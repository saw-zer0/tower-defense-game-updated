class Projectile extends Animatable {
    constructor(imageObject, x = 104, y = 203, width, height, dx = 0, dy = 0, floorHeight = Constants.FLOORHEIGHT, type = 'bullet') {

        super(imageObject, x, y, width, height, dx = 0, dy = 0, floorHeight = Constants.FLOORHEIGHT)
        this.launched = 0;
        this.giveDamage = true;
        this.type = type;
    }


    update(x, y) {
        this.draw();


        let slingshotCenter = [120, 164];
        let strechedLength = 80;
        if (getDistance(x, y, slingshotCenter[0], slingshotCenter[1]) > 80) {
            // find the closest point on circle;
            let vx = x - slingshotCenter[0];
            let vy = y - slingshotCenter[1];
            let dist = Math.sqrt(vx * vx + vy * vy);
            x = slingshotCenter[0] + vx / dist * strechedLength;
            y = slingshotCenter[1] + vy / dist * strechedLength;
        }



        if (this.launched === 0) {
            let cx = slingshotCenter[0];
            let cy = slingshotCenter[1];

            this.x = x - this.width / 2;
            this.y = y - this.height / 2;

            Physics.lineProjection(this.x, this.y, cx, cy);
        } else if (this.launched === 1) {


            let cx = slingshotCenter[0];
            let cy = slingshotCenter[1];
            let px = this.x;
            let py = this.y;

            let velocityObj = Physics.projectileVelocity(px, py, cx, cy);

            this.dx = velocityObj.dx;
            this.dy = velocityObj.dy;
            this.launched = 2;
        } else {
            if (this.y <= Constants.FLOORHEIGHT)
                this.gravity();
        }
        this.move();
        this.pos.x = this.x;
        this.pos.y = this.y;
        this.vel.x = this.dx;
        this.vel.y = this.dy;

        if (this.checkFrame(2)) {
            this.changeFrame(this.imageObject.image);
        }
        this.increaseCounter();
    }


    gravity() {
        if (this.y + this.height >= this.floorHeight) {
            this.dy = 0;
            this.dx = 0;
            this.vel.x = 0;
            this.vel.y = 0;

        } else {
            this.dy += Constants.GRAVITY_ACC;
            this.vel.y = this.dy;
        }
    }

}



// function findClosest(px, py, cx, cy, radius) {
//     let vx = px - cx;
//     let vy = py + cy;
//     let dist = Math.pow(vx, 2) + Math.pow(vy, 2);
//     return [cx + vx / dist * radius, cy + vy / dist * radius];
// }

// console.log(findClosest(800, 800, 104, 203, 80));


class Bomb extends Projectile {
    constructor(imageObject, x = 104, y = 203, width, height, dx = 0, dy = 10, floorHeight = Constants.FLOORHEIGHT, type = 'bomb') {

        super(imageObject, x, y, width, height, dx = 0, dy = 0, floorHeight = Constants.FLOORHEIGHT)
        this.type = 'bomb';
        this.dy -= 15;
        this.dx = 8;
        this.imagePosition = 0;
    }

    update() {
        this.draw();
        this.move();
        
        this.gravity();
        if(this.dx === 0 && this.dy === 0){
            if(this.checkFrame(4)){
                this.changeFrame(this.imageObject.image);
                this.imagePosition++;
                if(this.imagePosition > imagePosition.bomb.length - 1){
                    this.giveDamage = false;
                }
            }
            this.increaseCounter();
        }
    }
}