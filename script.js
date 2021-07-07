
function setup(){ 
	createCanvas(1200,800);
	frameRate(1);
}

function draw(){
	background(random(255),random(255),random(255));
	fill(255);
	circle(width/2,height/2,200);
	text(mouseX,20,20);
	text(mouseX,mouseX+30,60);
	
}
