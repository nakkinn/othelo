let peerid;
let dim;
var conn;
let inp;
let button;
let button2;
let x=0,y=0;

let a,b;
let swi1=false,swi2=false,swi3=false;

let w;
let board=new Array(10);
for(let i=0;i<10;i++){
    board[i]=new Array(10);
}
let potato=1,tomato=2;


const peer = new Peer({
    key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
    debug: 3
});

function setup(){


    createCanvas(600,600);

    inp=createInput('');
    button=createButton("接続");
    button.mousePressed(myInputEvent);
    
}

function draw(){
    if(swi1==false) background('#aaeeff');
        else{
            disp();
        }
    

}

function myInputEvent(){
    console.log(inp.value());
    peerid=inp.value();
    conn=peer.connect(peerid);
    conn.on("data", onRecvMessage);
    
    swi2=swi3=false;
    start();
}

peer.on('open', () => {
    
    dim=createP(peer.id);
    
});

peer.on('connection', function(connection){

    conn = connection;

    conn.on("open", function() {
        
    });
 
    conn.on("data", onRecvMessage);
    
    swi2=swi3=true;
    start();
});

function onRecvMessage(data){
    console.log(data);
    let r,c;
    r=Number(data.split(',')[0]);
    c=Number(data.split(',')[1]);
    console.log(r);
    flip(r,c);
    swi3=true;
    
}

function start(){
    resizeCanvas(windowWidth,windowHeight);
    w=min(width,height)*0.8;

    swi1=true;
    if(swi2)    console.log("先手");
        else    console.log("後手");
    button.remove();
    inp.remove();

    for(let i=0;i<10;i++)   for(let j=0;j<10;j++){
        board[i][j]=0;
    }
    board[5][5]=1;
    board[4][4]=1;
    board[5][4]=2;
    board[4][5]=2;
    if(swi2){
        potato=1;
        tomato=2;
    }else{
        potato=2;
        tomato=1;
    }
    
}

function mouseClicked(){
    if(swi3==true){
        console.log(board);
        let r,c;
        if(mouseX>=w/8&&mouseX<w/8+w&&mouseY>=w/8&&mouseY<w/8+w){
            r=int((mouseY-w/8)/(w/8))+1;
            c=int((mouseX-w/8)/(w/8))+1;
            if(judge(r,c)){
                board[r][c]=potato;
                swi3=false;
                conn.send(r+','+c);
    
            }
        }
    }
}

function judge(r,c){
    let y=[1,1,0,-1,-1,-1,0,1];
    let x=[0,1,1,1,0,-1,-1,-1];
    let result=0;

    if(board[r][c]==0){
        for(let i=0;i<8;i++){
           for(let j=1;j<8;j++){
               if(board[r+y[i]*j][c+x[i]*j]==0)   break;
               if(board[r+y[i]*j][c+x[i]*j]==potato){
                   for(let k=1;k<j;k++) board[r+y[i]*k][c+x[i]*k]=potato;
                   result+=j-1;
                   break;
               }
           }
        }
        console.log(result);
        if(result>0)    return true;
        
            else    return false;
    }else   return false;
        
}

function flip(r,c){
    let y=[1,1,0,-1,-1,-1,0,1];
    let x=[0,1,1,1,0,-1,-1,-1];
    
    for(let i=0;i<8;i++){
        for(let j=1;j<8;j++){
            if(board[r+y[i]*j][c+x[i]*j]==0)   break;
            if(board[r+y[i]*j][c+x[i]*j]==tomato){
                for(let k=1;k<j;k++) board[r+y[i]*k][c+x[i]*k]=tomato;
                break;
            }
        }
    }
    board[r][c]=tomato;
    
}


function disp(){
    background(240);
    if(!swi3)    background(200);
    
    fill('#1a9042');
    rect(w/8,w/8,w,w);

    fill(0);
    text(swi2,30,30);
    text(swi3,30,70);
    
    strokeWeight(3);
    for(let i=0;i<9;i++){
        line(w/8,w/8+w/8*i,w/8+w,w/8+w/8*i);
        line(w/8+w/8*i,w/8,w/8+w/8*i,w/8+w);
    }
    for(let i=1;i<9;i++)    for(let j=1;j<9;j++){
        if(board[i][j]==1){
            fill(0);
            circle(w/16+w/8*j,w/16+w/8*i,w/11);
        }else if(board[i][j]==2){
            fill(255);
            circle(w/16+w/8*j,w/16+w/8*i,w/11);
        }
    }

    
}
 
function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    w=min(width,height)*0.8;
}
