let r,g,b;

function setup(){ 
	createCanvas(1200,800);
	
}

function draw(){
	background(230);
	if(frameCount%60==0){
      r=random(255);
      g=random(255);
      b=random(255);
    }
	fill(r,g,b);
    noStroke();
	circle(mouseX,mouseY,100);
	
}
