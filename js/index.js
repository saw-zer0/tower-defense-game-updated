let canvas = document.getElementById('canvas');
let width = 1080;
let height = 720;
let game = new Canvas(canvas, width, height);

let rect = new Box(200, 200, 300, 300, 90);
rect.draw();