class Canvas {
    constructor(canvas, width, height) {
        this.self = this;
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext('2d');
        window.gfx = this.ctx;

        this.init();
    }

    init() {
        this.image = new Image();
        this.image.src = './images/sprite-sheet.png'
        this.image.onload = () => {
            this.drawBg();
            this.forceField = new Circle(-750, this.canvas.height / 1.5, this.canvas.width, 0, 0);
            this.generatePlayer();
            this.player1.draw();
            let startBtn = document.getElementById('start-button');
            let instructionBtn = document.getElementById('instruction-button');
            let restartBtn = document.getElementsByClassName('restart-button');
            let homeBtn = document.getElementsByClassName('home-button');
            let nextBtn = document.getElementById('next-button');
            let startScreen = document.getElementById('start-screen');
            let instructionScreen = document.getElementById('instruction-screen');
            let levelScreen = document.getElementById('level-clear-screen');


            startBtn.addEventListener('click', () => {
                this.startGame();
                startScreen.style.display = 'none';
            })

            instructionBtn.addEventListener('click', () => {
                startScreen.style.display = 'none';
                instructionScreen.style.display = 'flex';
            })

            Array.from(homeBtn).forEach(elem => {
                elem.addEventListener('click', () => {
                    startScreen.style.display = 'flex';
                    instructionScreen.style.display = 'none';
                    levelScreen.style.display = 'none';
                })
            })
        }
    }

    startGame() {
        this.mouseX = 0;
        this.mouseY = 0
        this.projectileArr = [];
        this.enemiesArr = [];

        this.pickupGenerationCounter = 0;

        this.score = {
            'bigwolf': 0,
            'drone': 0
        };
        this.slingShotCenter = [120, 164];
        this.mouseEvent();


        this.forceField.health = 150;
        this.refreshScreen();



    }

    drawBg() {
        let x = imagePosition.background[0];
        let y = imagePosition.background[1];
        let w = imagePosition.background[2];
        let h = imagePosition.background[3];
        gfx.drawImage(this.image, x, y, w, h, 0, 0, gfx.canvas.width, gfx.canvas.height);
    }

    generatePlayer() {
        let x = imagePosition.player[0];
        let y = imagePosition.player[1];
        let w = imagePosition.player[2];
        let h = imagePosition.player[3];
        let imageObject = {
            'image': this.image,
            'x': x,
            'y': y,
            'width': w,
            'height': h
        }
        this.player1 = new Player(imageObject, 30, 140, w, h);

    }

    generateProjectile() {
        let p = imagePosition.bullet[0];
        let x = p[0],
            y = p[1],
            w = p[2],
            h = p[3],
            imgObj = {
                'x': x,
                'y': y,
                'width': w,
                'height': h,
                'image': this.image
            }
        let centerCoordinates = [120, 164];

        let projectile = new Projectile(imgObj, this.mouseX - w / 2, this.mouseY - h / 2, w, h);
        this.projectileArr.push(projectile);

    }

    generateBomb() {
        if (this.bombTimeout === true) { return }
        setTimeout(() => {
            this.bombTimeout = false;
        }, 500);
        this.bombTimeout = true;
        let p = imagePosition.bomb[0];
        let x = p[0];
        let y = p[1];
        let w = p[2];
        let h = p[3];
        let imgObj = {
            'x': x,
            'y': y,
            'width': w,
            'height': h,
            'image': this.image
        }

        let bomb = new Bomb(imgObj, 120, 300, w, h);
        this.projectileArr.push(bomb);
    }

    generateEnemies() {
        let imgPos = imagePosition.bigWolf[0];
        let x = imgPos[0],
            y = imgPos[1],
            w = imgPos[2],
            h = imgPos[3];
        let imgObj = {
            'x': x,
            'y': y,
            'width': w,
            'height': h,
            'image': this.image
        }
        let enemy = new Enemy(imgObj, this.canvas.width, Constants.FLOORHEIGHT - h, imgObj.width, imgObj.heighth);
        this.enemiesArr.push(enemy)
    }

    generatePickUpEnemies() {

        let random = Math.random();
        let imgPos;
        if (random >= 0.7) {
            imgPos = imagePosition.drone[0];

            let x = imgPos[0],
                y = imgPos[1],
                w = imgPos[2],
                h = imgPos[3];
            let imgObj = {
                'x': x,
                'y': y,
                'width': w,
                'height': h,
                'image': this.image
            }
            let enemy = new FlyingEnemy(imgObj, this.canvas.width, getRandom(0, this.canvas.height / 2), w, h);
            this.enemiesArr.push(enemy)
        }
    }

    conditionToGenerateEnemy() {

        if (this.enemiesArr.length > 0) {

            if (this.pickupGenerationCounter >= 1) {
                this.generatePickUpEnemies();
                this.pickupGenerationCounter = 0;
            }
            if (this.enemiesArr[this.enemiesArr.length - 1].x < this.canvas.width - 350) {
                this.generateEnemies();
                this.pickupGenerationCounter++
            }
        }
        else {
            this.generateEnemies();
        }
    }

    mouseEvent() {
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - (this.canvas.offsetLeft);
            this.mouseY = event.clientY - this.canvas.offsetTop;
            console.log(this.mouseX, this.mouseY)
        })
        this.canvas.addEventListener('mousedown', (event) => {
            if (event.button !== 0) { return }
            if (getDistance(this.mouseX, this.mouseY, this.slingShotCenter[0], this.slingShotCenter[1]) <= 50) {
                this.generateProjectile();
            }
        })
        this.canvas.addEventListener('mouseup', () => {
            this.projectileArr.forEach(elem => {
                if (elem.launched === 0) {
                    elem.launched = 1;
                    elem.update();

                }
            })
        })
        window.addEventListener('keydown', (event) => {
            if (event.key !== ' ') { return };
            this.generateBomb();
        })
    }

    selfDestructProjectiles() {
        let firstElement = this.projectileArr[0]
        if ((firstElement.x > this.canvas.width || firstElement.x < 0 && firstElement.launched)) {
            this.projectileArr.shift();
        }
        else if (firstElement.dx === 0 && firstElement.dy === 0 && firstElement.launched === 2 && firstElement.setTimer === undefined) {
            if (firstElement.type !== 'bomb') {
                setTimeout(() => {
                    this.projectileArr.shift();
                }, 100);
                firstElement.setTimer = true;
            } else {
                setTimeout(() => {
                    this.projectileArr.shift();
                }, 497);
            }

        }
    }

    refreshScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBg();
        this.player1.draw();
        this.player1.drawCanon();
        if (this.bomb) {
            this.bomb.update();
        }

        this.forceField.draw();

        if (this.projectileArr.length > 0) {
            this.projectileArr.forEach(elem => {
                elem.update(this.mouseX, this.mouseY);
            })

            this.selfDestructProjectiles();
        }
        this.conditionToGenerateEnemy();

        if (this.enemiesArr.length > 0) {
            this.enemiesArr.forEach((elem) => {
                elem.update();

                if (elem.x < 490 && elem.type !== 'drone' && elem.type !== 'dying wolf') {
                    elem.type = 'attacking wolf'
                }


                // collision with projectile detection and Response;
                let rect = new Box(elem.x, elem.y, elem.x + elem.width - 40, elem.y, elem.height - 10, elem.dx, elem.dy);
                if (this.projectileArr.length > 0) {
                    this.projectileArr.forEach(projectile => {

                        let circle;

                        if (projectile.type !== 'bomb') {
                            circle = new Circle(projectile.x, projectile.y, projectile.width / 2, projectile.dx, projectile.dy);

                        } else {
                            if (projectile.dx !== 0 || projectile.dy !== 0) {
                                projectile.giveDamage = false;
                            } else {
                                projectile.giveDamage = true;
                                projectile.launched = 2;
                                circle = new Circle(projectile.x, projectile.y, projectile.width, projectile.dx, projectile.dy);
                            }
                        }

                        let collision;
                        if (projectile.giveDamage) {
                            collision = Collision.sat(rect, circle);
                        }
                        if (collision) {
                            let res = CollisionResponse.collisionResponse(rect, circle);
                            projectile.dx = res.b2.vel.x;
                            projectile.dy = res.b2.vel.y;
                            if (elem.type !== 'drone') {

                                projectile.giveDamage = false;

                                elem.type = 'crying wolf'
                                elem.damage();
                                if (elem.hitPoint === 0) {
                                    this.score.bigWolf += 1;
                                }
                                elem.dx = res.b1.vel.x / 1.3;
                                elem.dy = res.b1.vel.y / 1.3;
                            } else {
                                elem.dy += 3;
                                elem.dx += res.b2.vel.x;
                                projectile.giveDamage = false;
                                this.forceField.health += 25;
                                this.score.drone += 1;
                            }

                        }

                    })
                }


                //check collision with forcefield
                let collisionWithForceField = Collision.sat(rect, this.forceField)
                if (collisionWithForceField) {
                    elem.dx += 20;
                    this.forceField.health -= 1;
                    this.forceField.draw();

                    if (this.forceField.health <= 0) {
                        console.log('gameOver')
                    }
                }
            })
        }


        //remove dead
        this.enemiesArr = this.enemiesArr.filter(elem => {
            if (!elem.dead) {
                return elem;
            }
        });


        this.animate = window.requestAnimationFrame(this.refreshScreen.bind(this));

    }


    collisionTest() {
        let rect = new Box(200, 200, 300, 300, 90);
        rect.draw();

        let circle = new Circle(this.mouseX, this.mouseY, 30);
        circle.draw();

        let collision = Collision.sat(rect, circle);
        if (collision) { console.log('collided') }
    }

}