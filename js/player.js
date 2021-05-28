class Player extends Animatable {
    constructor(
        imageObject,
        x,
        y,
        width,
        height
    ) {
        super(imageObject, x, y, width, height)

        this.hitPoints = 8;
    }

    drawCanon() {
        let imgObj = {
            'image': this.imageObject.image,
            'x': imagePosition['canon'][0],
            'y': imagePosition['canon'][1],
            'width': imagePosition['canon'][2],
            'height': imagePosition['canon'][3],
        }
        gfx.drawImage(imgObj.image, imgObj.x, imgObj.y, imgObj.width, imgObj.height, 30, 360, imgObj.width, imgObj.height);
    }

    drawHealthBar(current, total) {
        if(current < 0){current = 0}
        gfx.font = '20px Verdana';
        gfx.fillStyle = '#333';
        gfx.fillText('Health: ', 30, 30);
        gfx.beginPath();
        gfx.moveTo(30, 50);
        gfx.lineTo(total * 3, 50);
        gfx.lineWidth = 10;
        gfx.lineCap = 'round'
        gfx.strokeStyle = '#777';
        gfx.stroke();
        gfx.closePath();
        gfx.beginPath();
        gfx.moveTo(30, 50);
        gfx.lineTo(current * 3, 50);
        if (current <= 10) {
            gfx.strokeStyle = '#300';
        } else if (current <= 30) {
            gfx.strokeStyle = '#900';
        } else if (current <= 50) {
            gfx.strokeStyle = '#d0d';
        }
        else {
            gfx.strokeStyle = '#0A0';
        }
        gfx.lineWidth = 20;
        gfx.stroke();
        gfx.closePath();
    }
}