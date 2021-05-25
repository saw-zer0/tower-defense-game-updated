class Animation {
    static FRAMECOUNTER = 1;
    static increaseCounter() {
        if (this.FRAMECOUNTER > 10) {
            this.FRAMECOUNTER = 1;
        } else {
            this.FRAMECOUNTER++;
        }
    }

    static changeFrame(image, object, objectType, currentImageIndex) {
        let nextIndex = (currentImageIndex + 1 >= imagePosition[`${objectType}`].length) ? 0 : currentImageIndex + 1;
        let p = imagePosition[objectType][nextIndex];
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

        object.imageObject = imgObj;
    }

    static checkFrame(delay){
        if(this.FRAMECOUNTER % delay === 0){
            return true;
        }
        return false;
    }


}