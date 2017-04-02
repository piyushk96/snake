/**
 * Created by piyush on 2/4/17.
 */

var canvas, ctx;
var GAME_WIDTH, GAME_HEIGHT;
var CELL_SIZE = 20;
var score;
var loop;
var snake;
var food = {
    x : null,
    y : null
};

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext('2d');
    var w = window.innerWidth - 200, h = window.innerHeight - 100;
    canvas.width = w - (w%CELL_SIZE) ;
    canvas.height = h - (h%CELL_SIZE);
    GAME_WIDTH = canvas.width;
    GAME_HEIGHT = canvas.height;
};

document.onkeydown = function (event) {
    var key = event.keyCode;
    direc = snake.direction;
    switch(key){
        case 37:
            if (direc!= 'right')
                snake.direction = 'left';
            break;

        case 39:
            if (direc != 'left')
                snake.direction = 'right';
            break;

        case 38:
            if (direc != 'down')
                snake.direction = 'up';
            break;

        case 40:
            if (direc != 'up')
                snake.direction = 'down';
            break;
    }
};

function init() {
    document.getElementById('start').style.display = 'none';
    score = 0;
    document.getElementById('score').innerHTML = 'Score : ' + score;
    createSnake();
    createFood();
    loop = setInterval(render, 80);
}

function createFood() {
    food.x = Math.floor(Math.random()*(GAME_WIDTH-CELL_SIZE)/CELL_SIZE) * CELL_SIZE;
    food.y = Math.floor(Math.random()*(GAME_HEIGHT-CELL_SIZE)/CELL_SIZE)* CELL_SIZE;

    //snake's body position
    for (var i=0; i<snake.length; i++) {
        var X = snake.body[i].x;
        var Y = snake.body[i].y;
        if (food.x == X && food.y == Y)
            createFood();
    }
}

function createSnake() {
    snake = {
        length : 7,
        direction : 'right',
        body : []
    };
    for(var i=snake.length ; i>0; i--){
        snake.body.push({
            x : i * CELL_SIZE,
            y : 20
        });
    }
}

function check_collision(x, y) {
    for(var i = 0; i < snake.length; i++) {
        if(snake.body[i].x == x && snake.body[i].y == y)
            return true;
    }
    return false;
}

function update(){
    var snakeHeadX = snake.body[0].x;
    var snakeHeadY = snake.body[0].y;

    //update position
    if(snake.direction == 'right')
        snakeHeadX += CELL_SIZE;
    else if(snake.direction == 'left')
        snakeHeadX -= CELL_SIZE;
    else if(snake.direction == 'up')
        snakeHeadY -= CELL_SIZE;
    else if(snake.direction == 'down')
        snakeHeadY += CELL_SIZE;

    if (snakeHeadX < 0 || snakeHeadX == GAME_WIDTH || snakeHeadY < 0 || snakeHeadY == GAME_HEIGHT || check_collision(snakeHeadX, snakeHeadY)) {
        //Stop the game.
        loop = clearInterval(loop);
        var btn = document.getElementById('start');
        btn.innerHTML = "Play Again";
        btn.style.display = 'block';
        return;
    }

    //collision with food
    if(snakeHeadX == food.x && snakeHeadY == food.y){
        score++;
        document.getElementById('score').innerHTML = 'Score : ' + score;
        createFood();
    }
    else
        snake.body.pop();       //pop last element

    snake.body.unshift({
        x : snakeHeadX,
        y : snakeHeadY
    });
    snake.length = snake.body.length;
}

function draw(){
    //clear screen
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);

    //snake
    for(var i=0; i<snake.length; i++) {
        ctx.fillStyle = 'darkblue';
        ctx.strokeRect(snake.body[i].x, snake.body[i].y, CELL_SIZE, CELL_SIZE);

        ctx.fillStyle = 'blue';
        ctx.fillRect(snake.body[i].x, snake.body[i].y, CELL_SIZE, CELL_SIZE);
    }
}

function render() {
    draw();
    update();
}
