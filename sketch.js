let img;
let input;

function preload(){
	input=createFileInput(callback);
	img=loadImage('moai.jpg');
}

function setup(){
	createCanvas(screen.width,screen.height);
	
}

function draw(){
	background(220);
	image(img,0,0);
	
}

function callback(file){

	if(file.type=="image"){
		img=loadImage(file.data); 
		
	}
	
}

