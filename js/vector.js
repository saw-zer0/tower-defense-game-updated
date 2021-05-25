class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    addVector(vector) {
        return new Vector(this.x + vector.x, this.y+ vector.y);
    }

    subVector(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiplyVector(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    }


    normal(){
        return new Vector(-this.y, this.x).unit();
    }

    unit(){
        if(this.magnitude() === 0){
            return new Vector(0,0);
        } else {
            return new Vector(this.x/this.magnitude(), this.y/this.magnitude());
        }
    }

    static crossProduct(vector1, vector2) {
        return (vector1.x * vector2.y - vector1.y * vector2.x);
    }

    static dotProduct(vector1, vector2){
        return (vector1.x * vector2.x + vector1.y * vector2.y)
    }
}