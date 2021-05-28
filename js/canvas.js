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
        this.soundBackground = new Sound('../assets/background.wav');
        this.soundBackground.sound.loop = true;
        this.soundExplode = new Sound('../assets/bomb.wav');
        this.soundSwosh = new Sound('./assets/swoosh.wav');
        this.soundSlash = new Sound('./assets/slash.mp3');
        this.soundCry = new Sound('./assets/cry.wav');
        this.soundCrash = new Sound('./assets/crash.wav');
        this.image.src = './images/sprite-sheet.png'
        this.image.onload = () => {
            this.soundBackground.play()
            this.drawBg();
            this.forceField = new Circle(-750, this.canvas.height / 1.5, this.canvas.width, 0, 0);
            this.generatePlayer();
            this.player1.draw();
            this.mouseEvent();

            let startBtn = document.getElementById('start-button');
            let instructionBtn = document.getElementById('instruction-button');
            let restartBtn = document.getElementsByClassName('restart-button');
            let homeBtn = document.getElementsByClassName('home-button');
            let nextBtn = document.getElementById('next-button');
            let startScreen = document.getElementById('start-screen');
            let instructionScreen = document.getElementById('instruction-screen');
            let levelScreen = document.getElementById('level-clear-screen');
            this.endScreen = document.getElementById('end-screen');


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
                    this.endScreen.style.display = 'none';
                })
            })

            Array.from(restartBtn).forEach(elem => {
                elem.addEventListener('click', () => {
                    this.endScreen.style.display = 'none';
                    this.startGame();
                })
            })
        }
    }

    startGame() {
        this.stopAnimation = false;
        this.mouseX = 0;
        this.mouseY = 0
        this.projectileArr = [];
        this.enemiesArr = [];
        this.obstacleArr = [];
        this.bossLevel = false;
        this.enemyCount = 0;

        this.pickupGenerationCounter = 0;

        this.score = {
            'bigwolf': 0,
            'drone': 0
        };
        this.slingShotCenter = [120, 164];

        this.forceField = new Circle(-750, this.canvas.height / 1.5, this.canvas.width, 0, 0);

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
        console.log(this.projectileArr)
    }

    generateBomb() {
        if (this.bombTimeout === true) { return }
        setTimeout(() => {
            this.bombTimeout = false;
        }, 5000);
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
        if (this.enemyCount >= 10) { this.bossLevel = true }
        if (this.bossLevel) {
            return;
        }
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

    generateBlocks(xPos, yPos, type) {
        let imgPos = imagePosition.blocks[type];
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


        let block = new Blocks(imgObj, xPos, yPos, imgObj.width, imgObj.height);
        this.obstacleArr.push(block);

    }

    conditionToGenerateBlocks() {
        let blockPosArr = [
            [600, 420, 1],
            [900, 420, 0],
        ];

        for (let i = 0; i < blockPosArr.length; i++) {
            this.generateBlocks(blockPosArr[i][0], blockPosArr[i][1], blockPosArr[i][2]);
        }
    }

    mouseEvent() {
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - (this.canvas.offsetLeft);
            this.mouseY = event.clientY - this.canvas.offsetTop;
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
            this.soundSwosh.play();
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
        this.player1.drawHealthBar(this.forceField.health, 150);





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
        // if (this.bossLevel && this.generateBossLevel === undefined) {
        //     this.conditionToGenerateBlocks();
        //     this.generateBossLevel = true;
        // }
        // if (this.obstacleArr.length > 0) {
        //     this.obstacleArr.forEach(elem => {
        //         elem.update()


        //         let rect1 = new Box(elem.x, elem.y, elem.x + elem.width, elem.y, elem.height, elem.dx, elem.dy);
        //         this.obstacleArr.forEach(obstacle => {
        //             let rect2 = new Box(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y, obstacle.height, obstacle.dx, obstacle.dy);
        //             let collision = Collision.satBoxBox(rect1, rect2);
        //             if (collision) {
        //                 let lower = (rect1.y < rect2.y) ? rect1 : rect2;
        //                 let upper = (rect1.y > rect2.y) ? rect1 : rect2;

        //                 let response = CollisionResponse.collisionResponse(rect1, rect2);

        //                     elem.dx = response.b1.vel.x;
        //                     elem.dy = response.b1.vel.y;
        //                     obstacle.dx = response.b2.vel.x;
        //                     obstacle.dy = response.b2.vel.y;
        //             }
        //         })
        //     })
        // }
        if (this.enemiesArr.length > 0) {

            this.enemiesArr.forEach((elem) => {
                elem.update();
                if(elem.type === 'attacking wolf' && elem.currentImageIndex === 7){
                    this.soundSlash.play();
                }
                if (elem.x < 490 && elem.type !== 'drone' && elem.type !== 'dead wolf') {
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
                                this.soundExplode.play();
                                circle = new Circle(projectile.x, projectile.y, projectile.width, projectile.dx, projectile.dy);
                            }
                        }

                        let collision;
                        if (projectile.giveDamage) {
                            collision = Collision.satBoxCircle(rect, circle);
                        }
                        if (collision) {
                            let res = CollisionResponse.collisionResponse(rect, circle);
                            projectile.dx = res.b2.vel.x;
                            projectile.dy = res.b2.vel.y;
                            if (elem.type !== 'drone') {

                                projectile.giveDamage = false;
                                this.soundCry.play();
                                elem.type = 'crying wolf'
                                elem.damage();
                                if (elem.hitPoint === 0) {
                                    this.score.bigWolf += 1;
                                }
                                elem.dx = res.b1.vel.x;
                                elem.dy = res.b1.vel.y;
                            } else {
                                elem.dy += 3;
                                elem.dx += res.b2.vel.x;
                                projectile.giveDamage = false;
                                if (this.forceField.health < 150) {
                                    this.forceField.health += 25;
                                } else if (this.forceField.health > 150) {
                                    this.forceField.health = 150;
                                }
                                this.score.drone += 1;
                                this.soundCrash.play();
                            }

                        }

                    })
                }


                //check collision with forcefield
                let collisionWithForceField = Collision.satBoxCircle(rect, this.forceField)
                if (collisionWithForceField) {
                    elem.dx += 20;
                    this.forceField.health -= 10;
                    if (this.forceField.health < 30) {
                        this.forceField.color = 'rgba(100, 0, 0, 20%)';
                    }
                    this.forceField.draw();

                    if (this.forceField.health <= 0) {
                        this.stopAnimation = true;
                        this.endScreen.style.display = 'flex';
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
        if (this.stopAnimation) {
            cancelAnimationFrame(this.animate);

        }
    }


    collisionTest() {
        let rect = new Box(200, 200, 300, 300, 90);
        rect.draw();

        let circle = new Circle(this.mouseX, this.mouseY, 30);
        circle.draw();

        let collision = Collision.satBoxCircle(rect, circle);
        if (collision) { console.log('collided') }
    }

}