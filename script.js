var gamePiece,
	canvasWidth = 960,
	canvasHeight = 540,
	enemy,

	background,

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
	gameOver = false,
	doOnce = true,

	finalTime, 
	finalScore,
	minuteCount = 0;

function startGame()
{
	gameArea.start();

	doOnce = true;

	var player = new Image();
	player.src = "images/rocketship.png";
	gamePiece = new component(player, 40, 38, "blue", 50, 270);

	var enemySprite = new Image();
	enemySprite.src = "images/alien.png";
	enemy = new component(enemySprite, 70, 42, "red", 800, 270);

	background = new Image();
	background.src = "images/background.jpg";
}

var gameArea = 
{
	canvas : document.createElement("canvas"),
	start : function()
	{
		var documentWidth = document.body.clientWidth;
		var documentHeight = Math.max(window.innerHeight, document.body.clientHeight);
		this.canvas.x = documentWidth/2;
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;

		var style = 
			"position: absolute;" +
			"left: 50%;" +
			"margin-left: -480px;" +
			"top: 50%;" +
			"margin-top: -270px;";

		this.canvas.setAttribute('style', style);
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(update, 1000/60);
	},
	clear : function()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.drawImage(background, 0, 0, canvasWidth, canvasHeight);
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
	if(startMoving)
		time = ++frame/60;

	if(time % 5 == 0)
	{
		console.log("increase chase speed");
		chaseSpeed += 0.01;
	}

	gameArea.clear();

	spawnEnemies();

	if(!startMoving)
		handleStartingUI();
	else
		handleIngameUI();		

	handleInput();
	gamePiece.move();
	checkCollision();
	checkEnemyCollision();
	if(!gameOver)
		gamePiece.update();
	else
		handleEndGameUI();
}

function handleStartingUI ()
{
	context.font = "30px Arial";
	context.strokeStyle = "#FFF";
	context.strokeText("Press Space to Start",345,280);
	context.strokeText("Controls: WASD",345,350);
}

function handleIngameUI ()
{
	context.font = "30px Arial";

	if (!gameOver)
	{
		context.strokeStyle = "#FFF";
		context.strokeText("Time: " + minuteCount.toFixed(0) + ":" + timeCount, 20, 50);
		context.strokeText("Score: " + scoreCount, 20, 520);
	}
	else 
	{
		if (doOnce)
		{
			finalTime = time.toFixed(1);
			finalScore = time.toFixed(0) * 100;
			doOnce = false;
		}
	}
}

function handleEndGameUI ()
{
	if (finalTime != null && finalScore !=null)
	{
		context.strokeText("Time: " + minuteCount + ":" + finalTime , 20, 50);
		context.strokeText("Score: " + finalScore , 20, 520);
	}
}

var 
	leftIsPressed = false, 
	rightIsPressed = false, 
	upIsPressed = false, 
	downIsPressed = false;

function handleInput()
{
	window.addEventListener("keydown", function(event)
	{
		var key = event.keyCode;
		if(key == w || key == up)
		{
			gamePiece.speedY = -speed;
			upIsPressed = true;
		}
		if(key == a || key == left)
		{
			gamePiece.speedX = -speed;
			leftIsPressed = true;
		}
		if(key == s || key == down)
		{
			gamePiece.speedY = speed;
			downIsPressed = true;
		}
		if(key == d || key == right)
		{
			gamePiece.speedX = speed;
			rightIsPressed = true;
		}
		if(key == spacebar)
			startMoving = true;

	});

	window.addEventListener("keyup", function(event)
	{
		var key = event.keyCode;
		if(key == w || key == up)
		{
			upIsPressed = false;
			if(!upIsPressed && !downIsPressed)
				gamePiece.speedY = 0;
		}
		if(key == s || key == down)
		{
			downIsPressed = false;
			if(!upIsPressed && !downIsPressed)
				gamePiece.speedY = 0;
		}

		if(key == a || key == left)
		{
			leftIsPressed = false;
			if(!leftIsPressed && !rightIsPressed)
				gamePiece.speedX = 0;
		}
		if(key == d || key == right)
		{
			rightIsPressed = false;
			if(!leftIsPressed && !rightIsPressed)
				gamePiece.speedX = 0;
		}
	});
}

function spawnEnemies()
{
	// enemy.speedX = (gamePiece.x - enemy.x) * chaseSpeed;
	// enemy.speedY = (gamePiece.y - enemy.y) * chaseSpeed;
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