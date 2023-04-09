const board = document.querySelector('#board');
const scoreBoard = document.querySelector('#scoreBoard');
const startButton = document.querySelector('#start');
const gameOverSign = document.querySelector('#gameOver');

// Game settings
const boardSize = 10; /*será 10x10 */
const gameSpeed = 100;
const squareTypes = {   /*Le asigno un valor a cada tipo de cuadrado */
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};
const directions = {    //mapeamos direcciones
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Game variables (las que se iran modificando a medida que avanza el juego)
let snake;
let score;
let direction;  /*Cada vez que aprieta el usuario una flechita de direccion */
let boardSquares; /*El Array con la info del tablero */
let emptySquares;   /*Para generar la comida de la serpiente en lugares aleatorios. De los lugares VARIOS. Guardamos aca los lugares vacios */
let moveInterval;   /*Donde guardaremos el intervalo que usaremos para hacer el movimiento de la serpiente. Una funcion que ejecuta una funcion cada determinado tiempo. El gameSpeed será quien use este intervalo cada determinado tiempo. */



const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}




//Rellena cada cuadrado  del tablero
//@parametros
//square: posicion del cuadrado
//type: tipo de cuadrado (emptySquare, snakeSquare,foodSquare)
const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }

}



const moveSnake = () => {
    const newSquare = String (
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
        const [row, column] = newSquare.split('');

        if(newSquare < 0 ||
            newSquare > boardSize * boardSize ||
            (direction === 'ArrowRight' && column == 0) ||
            (direction === 'ArrowLeft' && column == 9 ||
            boardSquares[row][column] === squareTypes.snakeSquare) ) {
            gameOver();    
        } else {
            snake.push(newSquare);
            if (boardSquares[row][column] === squareTypes.foodSquare) {
                addFood();
            } else {
                const emptySquare = snake.shift();
                drawSquare(emptySquare, 'emptySquare');
            }
            drawSnake();
        }
}







const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}


const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}


const setDirection = newDirection => {
    direction = newDirection;
}




const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)    
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;    
    }
}








const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}


const updateScore = () => {
    scoreBoard.innerText = score;
}




const createBoard = () => {
    boardSquares.forEach(  (row, rowIndex) => {
        row.forEach( (column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}


const setGame = () => {
    snake = ['00', '01', '02', '03']; /*Creamos la serpiente. Es una LISTA de números. Por eso corchetes. */
    score = snake.length -4;   /*El puntaje empieza en cero.? */
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}
//Eso ultimo es una estructura de datos con la info de nuestro tablero. 
//Es un Array de 2 dimensiones. Toma 2 parámetros: Array(boardSize) y cada uno de esos 10 elementos que contiene, le pasamos una función para que cada uno sea otro array, relleno con ceros (El tipo de cuadrado vacio) 




//cuando el juego termine vamos a tener que VOLVER a setear todas estas variables, por eso la hacemos una función especifica.
const startGame = () => {    /*Para darle valores a todas las variables del juego */
    setGame();
    gameOverSign.getElementsByClassName.display = 'none';   //Si perdió pero ahora vuelve a jugar, le ocultamos el GameOver 
    startButton.disabled = true; //bloqueamos el boton START mientras juega el usuario
    drawSnake();    //dibujamos la serpiente
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}




startButton.addEventListener('click', startGame);
