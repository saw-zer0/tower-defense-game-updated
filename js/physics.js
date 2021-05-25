//projectile angle
// dx and dy for projectiles
class Physics {
    static projectileVelocity(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let displacment = getDistance(x1, y1, x2, y2);
        let mass = 30;
        let hookesConstant = .5;
        let v = Math.sqrt((3 * hookesConstant * displacment * displacment) / mass);
        let angle = Math.atan2(dy, dx);


        let vx = v * Math.cos(angle);
        let vy = v * Math.sin(angle)*1.6;
        return { 'dx': vx, 'dy': vy };
    }
}
