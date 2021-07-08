let img;
let input;
let button;
let x,y;
let c;
let name='img';

function preload(){
	input=createFileInput(callback);
	img=loadImage("moai.jpg");
	button=createButton("Save Image");
	
	x=img.width;
	y=img.height;

}

function setup(){
	c=createCanvas(screen.width,screen.height);
	button.mousePressed(savebutton);
}

function draw(){
	background(255);
	
	if(img.width!=x||img.height!=y){
		x=img.width;
		y=img.height;

		resizeCanvas(x,y);
	}


	image(img,0,0)*0.9;
	filter(GRAY);
	
}

function callback(file){

	if(file.type=="image"){
		img=loadImage(file.data); 
		name=file.name.slice(0,4)
	}

}

function savebutton(){
	saveCanvas(c,'monochro'+name,'jpg')

}

