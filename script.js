
function setup(){ 
	createCanvas(1200,800);

}

function draw(){
	background(255);
	fill(0);
	textSize(60);
	text(mouseX+" "+mouseY,mouseX,mouseY);
	ellipse(width/2,height/2,400);
}
