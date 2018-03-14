var gamePiece,
	canvasWidth = 960,
	canvasHeight = 540,
	enemy,

	w = 87,
	a = 65,
	s = 83,
	d = 68,
	left = 37,
	right = 39,
	up = 38,
	down = 40,
	spacebar = 32,

	speed = 10,
	chaseSpeed = 0.05,
	frame = 0,
	time,

	startMoving = false,
	gameOver = false;

function startGame()
{
	gameArea.start();

	var player = new Image;
	player.src = "images/rocketship.png";
	gamePiece = new component(player, 40, 38, "blue", 50, 270);

	var enemySprite = new Image;
	enemySprite.src = "images/alien.png";
	enemy = new component(enemySprite, 70, 42, "red", 800, 270);
}

var gameArea = 
{
	canvas : document.createElement("canvas"),
	start : function()
	{
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(update, 1000/60);
	},
	clear : function()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
	
function component(sprite, width, height, color, x, y)
{
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0
	this.update = function()
	{
		context = gameArea.context;
		context.drawImage(sprite, this.x, this.y, this.width, this.height);
		// context.fillStyle = color;
		// context.fillRect(this.x, this.y, this.width, this.height);
	},
	this.move = function()
	{
		if(startMoving && !gameOver)
		{
			this.x += this.speedX;
			this.y += this.speedY;
		}
	},
	this.destroy = function()
	{
		gameOver = true;
	}
}

function update()
{
	console.log("time is running");

	if(startMoving)
		time = ++frame/60;

	if(time % 5 == 0)
	{
		console.log("increase chase speed");
		chaseSpeed += 0.01;
	}

	gameArea.clear();

	spawnEnemies();

	if(startMoving)
		handleUI();
	handleInput();
	gamePiece.move();
	checkCollision();
	checkEnemyCollision();
	if(!gameOver)
		gamePiece.update();
}

function handleUI ()
{
	context.font = "30px Arial";

	var timeDisplayText = 0;

	context.strokeText("Time: " + timeDisplayText.toFixed(1),20,50);
	context.strokeText("Score: " + timeDisplayText.toFixed(0) * 100,20,520);
}

function countUp ()
{
	
}

function handleInput()
{
	window.addEventListener("keydown", function(event)
	{
		var key = event.keyCode;
		if(key == w || key == up)
			gamePiece.speedY = -speed;
		else if(key == a || key == left)
			gamePiece.speedX = -speed;
		else if(key == s || key == down)
			gamePiece.speedY = speed;
		else if(key == d || key == right)
			gamePiece.speedX = speed;
		else if(key == spacebar)
			startMoving = true;
	});

	window.addEventListener("keyup", function(event)
	{
		var key = event.keyCode;
		if(key == w || key == up)
			gamePiece.speedY = 0;
		else if(key == a || key == left)
			gamePiece.speedX = 0;
		else if(key == s || key == down)
			gamePiece.speedY = 0;
		else if(key == d || key == right)
			gamePiece.speedX = 0;
	});
}

function spawnEnemies()
{
	enemy.speedX = (gamePiece.x - enemy.x) * chaseSpeed;
	enemy.speedY = (gamePiece.y - enemy.y) * chaseSpeed;
	enemy.move();
	enemy.update();
}

function checkCollision()
{
	if(gamePiece.x >= canvasWidth - gamePiece.width)
		gamePiece.x = canvasWidth - gamePiece.width;
	if(gamePiece.x <= 0)
		gamePiece.x = 0;
	if(gamePiece.y >= canvasHeight - gamePiece.height)
		gamePiece.y = canvasHeight - gamePiece.height;
	if(gamePiece.y <= 0)
		gamePiece.y = 0;
}

function checkEnemyCollision()
{
	if(gamePiece.x + gamePiece.width >= enemy.x 
	&& gamePiece.y + gamePiece.height>= enemy.y
	&& gamePiece.x <= enemy.x + enemy.width
	&& gamePiece.y <= enemy.y + enemy.height)
		gamePiece.destroy();
}