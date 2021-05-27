class Player extends Animatable{
    constructor(
        imageObject,
        x, 
        y, 
        width, 
        height
    ){
        super(imageObject, x, y, width, height)

        this.hitPoints = 8;
    }

    drawCanon(){
        let imgObj = {
            'image': this.imageObject.image,
            'x': imagePosition['canon'][0],
            'y': imagePosition['canon'][1],
            'width': imagePosition['canon'][2],
            'height': imagePosition['canon'][3],
        }
        gfx.drawImage(imgObj.image, imgObj.x, imgObj.y, imgObj.width, imgObj.height, 30, 360, imgObj.width, imgObj.height);
    }
}