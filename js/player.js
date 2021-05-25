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
}