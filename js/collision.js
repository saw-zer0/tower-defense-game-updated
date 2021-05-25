class Box {
    constructor(x1, y1, x2, y2, w, dx, dy) {
        this.name = 'rectangle';
        this.vertex = [];
        this.vertex[0] = new Vector(x1, y1);
        this.vertex[1] = new Vector(x2, y2);
        this.edge = this.vertex[1].subVector(this.vertex[0]);

        this.length = this.edge.magnitude();
        this.dir = this.edge.unit();
        this.width = w;
        this.vertex[2] = this.vertex[1].addVector(this.dir.normal().multiplyVector(this.width));

        this.vertex[3] = this.vertex[2].addVector(this.dir.multiplyVector(-this.length));

        this.pos = new Vector(x1 + this.length / 2, y1 + w / 2);
        this.vel = new Vector(dx, dy);
    }

    draw() {
        gfx.fillStyle = 'red';
        // gfx.fillRect(this.vertex[0].x, this.vertex[0].y, this.width, this.length);
        gfx.beginPath();
        gfx.moveTo(this.vertex[0].x, this.vertex[0].y)
        gfx.lineTo(this.vertex[1].x, this.vertex[1].y)
        gfx.lineTo(this.vertex[2].x, this.vertex[2].y)
        gfx.lineTo(this.vertex[3].x, this.vertex[3].y)
        gfx.lineTo(this.vertex[0].x, this.vertex[0].y)
        gfx.stroke();
        gfx.closePath();

    }
}


class Circle {
    constructor(x, y, r, dx, dy) {
        this.name = 'circle';
        this.center = new Vector(x, y);
        this.radius = r;
        this.vertex = [];
        this.vertex.push(this.center);
        this.pos = new Vector(x, y);
        this.vel = new Vector(dx, dy);
    }

    draw() {
        gfx.strokeStyle = 'rgba(255, 255, 255, 30%)';
        gfx.lineWidth = 100;
        gfx.beginPath();
        gfx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        gfx.closePath();
        gfx.stroke();
    }
}

class Collision {
    static sat(box, circle) {
        let axes1 = [];
        let axes2 = [];
        axes1.push(box.dir.normal());
        axes1.push(box.dir);

        //find the closest vertex of box to center of circle, subtract vector from center, get normal of that vector=cv

        let smallestFromCenter;
        box.vertex.forEach(elem => {
            let cv = elem.subVector(circle.center);
            if (smallestFromCenter) {
                if (cv.magnitude() < smallestFromCenter.magnitude()) {
                    smallestFromCenter = cv;
                }
            } else {
                smallestFromCenter = cv;
            }
        })
        axes2.push(smallestFromCenter);
        if (smallestFromCenter.magnitude() < circle.radius) {
            return true;
        }

        for (let i = 0; i < axes1.length; i++) {
            let projection1 = this.projectBoxOnAxis(axes1[i], box);
            let projection2 = this.projectBoxOnAxis(axes1[i], circle);
            let overlap = Math.min(projection1.max, projection2.max) - Math.max(projection1.min, projection2.min);
            if (overlap < 0) {
                return false;
            }

        }

        for (let i = 0; i < axes2.length; i++) {
            let projection1 = this.projectBoxOnAxis(axes2[i], box);
            let projection2 = this.projectBoxOnAxis(axes2[i], circle);
            let overlap = Math.min(projection1.max, projection2.max) - Math.max(projection1.min, projection2.min);
            if (overlap < 0) {
                return false;
            }
        }

        return true;
    }

    static projectBoxOnAxis(axis, object) {
        let min = Vector.dotProduct(axis, object.vertex[0]);
        let max = min;

        for (let i = 0; i < object.vertex.length; i++) {
            let tempVertex = object.vertex[i];
            let projection = Vector.dotProduct(axis, tempVertex);
            if (object.name !== 'circle') {
                if (projection < min) {
                    min = projection;
                } else if (projection > max) {
                    max = projection;
                }
            } else {
                min = Vector.dotProduct(axis, object.vertex[0]) - object.radius;
                max = Vector.dotProduct(axis, object.vertex[0]) + object.radius;
            }

        }

        return { min, max };
    }


}


class CollisionResponse {
    static collisionResponse(b1, b2) {
        //collision normal vector
        let normal = b1.pos.subVector(b2.pos).unit();
        //relative velocity vector
        let relVel = b1.vel.subVector(b2.vel);
        //separating velocity - relVel projected onto the collision normal vector
        let sepVel = Vector.dotProduct(relVel, normal);
        //the projection value after the collision (multiplied by -1)
        let new_sepVel = -sepVel;
        //collision normal vector with the magnitude of the new_sepVel
        let sepVelVec = normal.multiplyVector(new_sepVel);

        //adding the separating velocity vector to the original vel. vector
        b1.vel = b1.vel.addVector(sepVelVec);
        //adding its opposite to the other balls original vel. vector
        b2.vel = b2.vel.addVector(sepVelVec.multiplyVector(-1));
        return { b1, b2 }

    }
}