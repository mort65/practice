window.onload = function () {
    const cvs = document.querySelector('canvas');
    const ctx = cvs.getContext('2d');
    const BACKGROUND_COLOR = 'black';
    const INTERVAL = 140;
    const DEFAULT_RESET_TIMER = 500;
    const snake = {
        segments: [{
            x: 5,
            y: 13
        }, {
            x: 4,
            y: 13
        }, {
            x: 3,
            y: 13
        }],
        score: 0,
        height: 10,
        width: 10,
        speed: 1,
        velocityX: 1,
        velocityY: 0,
        color: "white",
        state: "",
        move: function () {
            this.segments.pop();
            this.grow();
        },
        rotate: function (directionX, directionY) {
            if (directionX < 0 && !directionY) { //left
                if (this.velocityX !== 0) {
                    return;
                }
                this.velocityX = directionX * this.speed;
                this.velocityY = directionY * this.speed;
            }
            if (directionX > 0 && !directionY) { //right
                if (this.velocityX !== 0) {
                    return;
                }
                this.velocityX = directionX * this.speed;
                this.velocityY = directionY * this.speed;
            }
            if (directionY < 0 && !directionX) { //up
                if (this.velocityY !== 0) {
                    return;
                }
                this.velocityX = directionX * this.speed;
                this.velocityY = directionY * this.speed;
            }
            if (directionY > 0 && !directionX) { //down
                if (this.velocityY !== 0) {
                    return;
                }
                this.velocityX = directionX * this.speed;
                this.velocityY = directionY * this.speed;
            }
            snake.state = "rotation";
        },
        grow: function () {
            this.segments.unshift({
                x: this.segments[0].x + this.velocityX,
                y: this.segments[0].y + this.velocityY
            });
        }
    };
    const food = {
        pos: {
            x: 13,
            y: 10
        },
        rad: snake.width / 2,
        color: "#55FF2F"
    };
    var state = "";
    var resetTimer = DEFAULT_RESET_TIMER;

    function resetGame() {
        snake.score = 0;
        snake.segments = [{
            x: 5,
            y: 13
        }, {
            x: 4,
            y: 13
        }, {
            x: 3,
            y: 13
        }];
        snake.speed = 1;
        snake.velocityX = 1;
        snake.velocityY = 0;
        snake.height = 10;
        snake.width = 10;
        snake.state = "";
        snake.color = "white";
        food.pos.x = 13;
        food.pos.y = 10;
        state = "";
        resetTimer = DEFAULT_RESET_TIMER;
    }

    function drawRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    function drawCircle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    function drawSnakeSeg(x, y, w, h, c) {
        drawRect(x, y, w, h, c);
    }

    function drawSnake(_snake) {
        for (var i = 0; i < _snake.segments.length; i++) {
            drawSnakeSeg(_snake.segments[i].x * _snake.width, _snake.segments[i].y * _snake.height, _snake.width, _snake.height, _snake.color);
        }
    }

    function drawFood(x, y, r, color) {
        drawCircle(x * snake.width + r, y * snake.height + r, r, color);
    }

    function updateScore() {
        document.getElementById('score').innerText = snake.score;
    }

    function selfCollision(x, y, array) {
        for (var i = 0; i < array.length; i++)
            if (x === array[i].x && y === array[i].y)
                return true;
        return false;
    }

    function edgeCollision(x, y) {
        return (x < 0 || y < 0 || x >= (cvs.width / snake.width) || y >= (cvs.height / snake.height));
    }

    function foodCollision(x, y) {
        return (x === food.pos.x && y === food.pos.y);
    }

    function collision(x, y) {
        if (edgeCollision(x, y) || selfCollision(x, y, snake.segments)) {
            return -1;
        } else if (foodCollision(x, y)) {
            return 1;
        }
        return 0;
    }

    function render() {
        // clear the canvas
        drawRect(0, 0, cvs.width, cvs.height, BACKGROUND_COLOR);
        drawSnake(snake);
        drawFood(food.pos.x, food.pos.y, food.rad, food.color);
    }

    function update() {
        var colide = collision(snake.segments[0].x + snake.velocityX, snake.segments[0].y + snake.velocityY);
        if (colide === -1) {
            state = "defeat";
            snake.color = "red";
        } else if (colide === 1) {
            snake.grow();
            do {
                food.pos.x = Math.round(Math.random() * (cvs.width / (food.rad * 2) - 1));
            }
            while (food.pos.x === snake.segments[0].x);
            do {
                food.pos.y = Math.round(Math.random() * (cvs.height / (food.rad * 2) - 1));
            }
            while (food.pos.y === snake.segments[0].y);
            snake.score++;
        } else {
            snake.move();
        }

        updateScore();

        if (snake.state === "rotation") {
            snake.state = "";
        }
    }

    function game() {
        if (state === "defeat") {
            if (resetTimer === DEFAULT_RESET_TIMER) {
                render();
            }
            resetTimer -= INTERVAL;
            if (resetTimer <= 0) {
                resetGame();
            }
        } else if (state !== "pause") {
            render();
            update();
        }
    }

    document.addEventListener('keydown', function (event) {
        if ((event.keyCode === 37 || event.keyCode === 65) && snake.state !== "rotation") { //left arrow, a
            event.preventDefault();
            snake.rotate(-1, 0);
        } else if ((event.keyCode === 38 || event.keyCode === 87) && snake.state !== "rotation") { //up arrow, w
            event.preventDefault();
            snake.rotate(0, -1);
        } else if ((event.keyCode === 39 || event.keyCode === 68) && snake.state !== "rotation") { //right arrow, d
            event.preventDefault();
            snake.rotate(1, 0);
        } else if ((event.keyCode === 40 || event.keyCode === 83) && snake.state !== "rotation") { //down arrow, s
            event.preventDefault();
            snake.rotate(0, 1);
        } else if (event.keyCode === 19) { //pause
            if (state === "pause")
                state = "";
            else {
                state = "pause";
            }
        }
    });

    cvs.addEventListener('click', function (event) {
        if (snake.state !== "rotation") {
            var rect = cvs.getBoundingClientRect();
            var root = document.documentElement;
            var eX = parseInt(event.clientX) - rect.left - root.scrollLeft;
            var eY = parseInt(event.clientY) - rect.top - root.scrollTop;
            if (snake.velocityX) {
                if (eY >= snake.segments[0].y * snake.height) { //down
                    event.preventDefault();
                    snake.rotate(0, 1);
                } else { //up
                    event.preventDefault();
                    snake.rotate(0, -1);
                }
            } else if (snake.velocityY) {
                if (eX >= snake.segments[0].x * snake.width) { //right
                    event.preventDefault();
                    snake.rotate(1, 0);
                } else { //left
                    event.preventDefault();
                    snake.rotate(-1, 0);
                }
            }
        }
    });

    setInterval(game, INTERVAL);

};
