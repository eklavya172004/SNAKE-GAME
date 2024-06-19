const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highscoretext = document.getElementById("high-score");

//define game variables
const grid = 20;
let snake = [{x:10,y:10}];
let food = generatefood();
let Highscore = 0;
let direction = 'right';
let gameinterval;
let gamespeeddelay = 200;
let gamestarted = false;

//drawing game map , snake , food
function draw(){
    board.innerHTML = '';
    drawsnake();
    drawfood();
    updateScore();
}

//draw snake 
function drawsnake(){
        snake.forEach((segment)=>{
            const snakeElement = createGameElement('div','snake');
            setposition(snakeElement,segment);
            board.appendChild(snakeElement);
        })
}

//create a snake or food
function createGameElement(tag,className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//setting position of snake or food
function setposition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
//testing
// draw()

// drawing food
function drawfood(){
    if(gamestarted){
    const foodelement = createGameElement('div','food');
    setposition(foodelement,food);
    board.appendChild(foodelement);
    }
}

//generating position of food
function generatefood(){
    const x = Math.floor(Math.random()*grid)+1;
    const y = Math.floor(Math.random()*grid)+1;
    return {x,y};
}

//Moving the snake
function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'up':
            head.y--;
            break;
        
        case 'down':
            head.y++;
            break;
        
        case 'right':
            head.x++;
            break;
        
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head);
    // snake.pop();

    if(head.x === food.x && head.y === food.y){
        food = generatefood();
        increaseSpeed();
        clearInterval(gameinterval);
        gameinterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
        },gamespeeddelay);
    }else{
        snake.pop();
    }
}

// setInterval(()=>{
//     move();
//     draw();

// },200);

// Start game function 
function startgame(){
    gamestarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none'
    gameinterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gamespeeddelay);
}

// Keypress event listener
function handlekeypress(event){
    if((!gamestarted && event.code === 'Space')||(!gamestarted && event.key === '')){
    startgame();        
    }
    else{
        switch(event.key){
            case 'ArrowUp':
            direction = 'up';
            break;
            
            case 'ArrowDown':
            direction = 'down';
            break;
            
            case 'ArrowLeft':
            direction = 'left';
            break;
            
            case 'ArrowRight':
            direction = 'right';
            break;
        }
    }
}

document.addEventListener('keydown',handlekeypress);

function increaseSpeed(){
    if(gamespeeddelay>150){
        gamespeeddelay-=5;
    }
    else if(gamespeeddelay>100)
        {
         gamespeeddelay-=3;
    }
    else if(gamespeeddelay>50)
        {
         gamespeeddelay-=2;
    }
    else if(gamespeeddelay>25)
        {
         gamespeeddelay-=1;
    }
    // console.log(gamespeeddelay);
}

function checkCollision(){
    const head = snake[0];

    if(head.x < 1 || head.x > grid || head.y < 1 || head.y > grid){
        resetgame();
    }
    for(let i=1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetgame();
        }
    }
}

function resetgame(){
        highscore();
        stopgame();
        snake = [{x:10,y:10}];
        food = generatefood();
        direction = 'right';
        gamespeeddelay = 200;
        updateScore();
}

function updateScore(){
    const currentscore = snake.length - 1;
    score.textContent = currentscore.toString().padStart(3,'0');
}

function stopgame(){
    clearInterval(gameinterval);
    gamestarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function highscore(){
    const currentscore = snake.length - 1;
    if(currentscore > Highscore){
        Highscore = currentscore ;
        highscoretext.textContent = Highscore.toString().padStart(3,'0');
    }
    highscoretext.style.display = 'block';
}

