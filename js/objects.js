class Animatable{
    constructor(imageObject, x, y, width, height, dx = 0, dy = 0, floorHeight = Constants.FLOORHEIGHT){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;

        this.pos = new Vector(x, y);
        this.vel = new Vector(dx, dy);

        // imageObject should have loaded img with src, x position(imgX), y position(imgY), width of image(imgWidth), height of image(imgHeight)
        this.imageObject = imageObject;
        this.currentImageIndex = 0;
        this.type;
        this.accDueToGracity = Constants.GRAVITY_ACC;
        this.floorHeight = floorHeight;
        this.framecounter = 0;
    }

    draw(){
        let imgX = this.imageObject.x,
        imgY = this.imageObject.y,
        imgWidth = this.imageObject.width,
        imgHeight = this.imageObject.height;
        gfx.drawImage(this.imageObject.image, imgX, imgY, imgWidth, imgHeight, this.x, this.y, this.width, this.height);
    }

    move(){
        this.x += this.dx;
        this.y += this.dy;
        this.pos = this.pos.addVector(this.vel);
    }



    jump(){
        this.dy -=5;
        this.vel.y = this.dy;
    }

    gravity(){
        if(this.y + this.height >= this.floorHeight){
            this.dy = 0;
            this.dx = 0;
            this.vel.x = 0;
            this.vel.y = 0;
            // if(this.y > this.floorHeight){
            //     this.dy = -1;
            // }
        }else{
            this.dy += this.accDueToGracity;
            this.vel.y = this.dy;
        }
    }

    update(){
        this.draw();
        this.move();
        this.gravity();
    }

    increaseCounter() {
        if (this.framecounter > 10) {
            this.framecounter = 1;
        } else {
            this.framecounter++;
        }
    }

    changeFrame(image) {
        let nextIndex = (this.currentImageIndex >= imagePosition[this.type].length - 1) ? 0 : this.currentImageIndex + 1;
        let p = imagePosition[this.type][nextIndex];
        let x = p[0],
            y = p[1],
            w = p[2],
            h = p[3],
            imgObj = {
                'x': x,
                'y': y,
                'width': w,
                'height': h,
                'image': image
            }

        this.imageObject = imgObj;
        this.currentImageIndex = nextIndex;
    }

    checkFrame(delay){
        if(this.framecounter % delay === 0){
            return true;
        }
        return false;
    }

}