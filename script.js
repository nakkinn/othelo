function setup(){ 
	createCanvas(1200,800);
	frameRate(1);
}

function draw(){
	background(random(250),random(255),random(255));
	fill(0);
	text(mouseX,50,50);
	
}
