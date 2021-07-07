
function setup(){ 
	createCanvas(windowWidth,windowHeight);
	colorMode(HSB,800,100,100);
}

function draw(){
	background("#f0f0f0");
    noStroke();
	fill(frameCount%800,100,80);
	ellipse(mouseX,mouseY,400);
}
