let dim;
var conn;
let inp,button;
let url;
let swi1=false,swi2=false,swi3=false,swi4=false;

let w;
let board=new Array(10);
for(let i=0;i<10;i++){
    board[i]=new Array(10);
}
let potato=1,tomato=2;
let resp=0,rest=0;

let peer;

function setup(){


    createCanvas(200,200);
    
    
    
    peer= new Peer(makeid(),{
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug: 3
        
    });

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


    inp=createInput('');
    button=createButton("接続");
    button.mousePressed(myInputEvent);
    
    url=createA('https://t.co/hCCMOMXzHu?amp=1', 'home');
    url.position(30,500);
    
}

function draw(){
    if(swi1==false){
        background('#aaeeff');
        fill(0);
        text("相手のidを入力してください",30,height/2);
    }else    disp();
    
    

}

function myInputEvent(){
    
    conn=peer.connect(inp.value());
    conn.on("data", onRecvMessage);
    
    swi2=swi3=false;
    start();
}


function onRecvMessage(data){
    console.log(data);
    let r,c;
    r=Number(data.split(',')[0]);
    c=Number(data.split(',')[1]);
    flip(r,c,tomato);
    if(data.split(',')[2]=='a') swi3=true;
    if(data.split(',')[2]=='c'){
        count();
        swi4=true;
    }
    
}

function start(){
    resizeCanvas(windowWidth,windowHeight);
    w=min(width,height)*0.8;

    swi1=true;
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
    url.position(20,windowHeight+60);
}

function mouseClicked(){
    if(swi3==true&&swi4==false){
        console.log(board);
        let r,c;
        if(mouseX>=w/8&&mouseX<w/8+w&&mouseY>=w/8&&mouseY<w/8+w){
            r=int((mouseY-w/8)/(w/8))+1;
            c=int((mouseX-w/8)/(w/8))+1;
            if(judge(r,c,potato)){
                flip(r,c,potato)
                
                if(enable(tomato)){
                    swi3=false;
                    conn.send(r+','+c+',a');
                }else{
                    conn.send(r+','+c+',b');
                }
                if(enable(potato)==false&&enable(tomato)==false){
                    swi3=false;
                    swi4=true;
                    count();
                    conn.send(r+','+c+',c');
                }
                
    
            }
        }
    }
}

function judge(r,c,s){
    let y=[1,1,0,-1,-1,-1,0,1];
    let x=[0,1,1,1,0,-1,-1,-1];
    let result=0;

    if(board[r][c]==0){
        for(let i=0;i<8;i++){
           for(let j=1;j<8;j++){
               if(board[r+y[i]*j][c+x[i]*j]==0)   break;
               if(board[r+y[i]*j][c+x[i]*j]==s){
                   //for(let k=1;k<j;k++) board[r+y[i]*k][c+x[i]*k]=potato;
                   result+=j-1;
                   break;
               }
           }
        }
           if(result>0)    return true;
        
            else    return false;
    }else   return false;
        
}

function flip(r,c,s){
    let y=[1,1,0,-1,-1,-1,0,1];
    let x=[0,1,1,1,0,-1,-1,-1];
    
    for(let i=0;i<8;i++){
        for(let j=1;j<8;j++){
            if(board[r+y[i]*j][c+x[i]*j]==0)   break;
            if(board[r+y[i]*j][c+x[i]*j]==s){
                for(let k=1;k<j;k++) board[r+y[i]*k][c+x[i]*k]=s;
                break;
            }
        }
    }
    board[r][c]=s;
    
}

function enable(s){
    for(let i=1;i<9;i++)    for(let j=1;j<9;j++){
        if(board[i][j]==0){
            if(judge(i,j,s)) return true;
        }
    }
    return false;
}


function disp(){
    background(240);
    
    if(swi2)    fill(0);
        else    fill(255);
    circle(20,20,30);
    
    if(swi3){
        noStroke();
        fill('#dd5555');
        square(w/8-w/50,w/8-w/50,w+w/25);
        stroke(0);
    }
     fill('#1a9042');
    rect(w/8,w/8,w,w);
    
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

    noStroke();
    textSize(25);
    if(swi3&&!swi4){
        textSize(30);
        fill(0);
        text("あなたの番です",50,30);
    }else if(!swi4){
        fill('#554499');
        text("相手の番です",50,30);
        
    }

    if(swi4){
        fill(0);
        if(resp>rest)   text("ゲーム終了　くろの勝ち！！",50,30);
            else    text("ゲーム終了　しろの勝ち！！",50,30);
        text("くろ："+resp+"  しろ："+rest,50,60);

    }
    stroke(0);
    
}


 
function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    w=min(width,height)*0.8;
}

function makeid() {
    var text = "";
    var possible = "abcdefghijkmnopqrstuvwxyz023456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function count(){
    for(let i=1;i<9;i++)    for(let j=1;j<9;j++){
        if(board[i][j]==1)  resp++;
        if(board[i][j]==2)  rest++;
    }
}
  
