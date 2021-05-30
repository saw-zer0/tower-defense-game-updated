//projectile angle
// dx and dy for projectiles
class Physics {
    static projectileVelocity(x1, y1, x2, y2) {
        let values = this.initialVelocity(x1,y1,x2,y2);

        let vx = values.v * Math.cos(values.angle);
        let vy = values.v * Math.sin(values.angle)*1.6;
        return { 'dx': vx, 'dy': vy };
    }

    static lineProjection(x1,y1,x2,y2){
        let values = this.initialVelocity(x1,y1,x2,y2);
        for(let x = 0; x <= 300; x+=30){
            let firstPart = -Math.tan(values.angle) * x; 
            let secondNumerator = x * x;
            let secondDenominator = 2 * values.v * Math.pow(Math.cos(values.angle),2)
            let y = firstPart - (secondNumerator/secondDenominator)/25;
            this.drawDot(x+140, -y + 164);
        }


    }

    static drawDot(x,y){
        gfx.beginPath();
        gfx.arc(x, y, 10, 0, 2 * Math.PI);
        gfx.closePath();
        gfx.fillStyle = 'rgba(200, 200, 200, 40%)';
        gfx.fill();
    }

    static initialVelocity(x1, y1, x2, y2){
        let dx = x2 - x1;
        let dy = y2 - y1;
        let displacment = getDistance(x1, y1, x2, y2);
        let mass = 30;
        let hookesConstant = .9;
        let angle = Math.atan2(dy, dx);
        let v = Math.sqrt((2*hookesConstant * displacment * displacment) / mass);
    
        return({'v':v, 'angle': angle});
    }
}
