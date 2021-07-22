let peerid;
let dim;
var conn;
let inp;
let button;
let button2;
let x=0,y=0;

let a,b;
let swi1=false,swi2=false;


const peer = new Peer({
    key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
    debug: 3
});

function setup(){


    createCanvas(400,400);
    inp=createInput('');
    button=createButton("接続");
    button.mousePressed(myInputEvent);
    
}

function draw(){
    if(swi1==false) background('#aaeeff');
        else if(swi2==false){
            background('#111111');
        }else background('#cccccc');
    
    


}

function myInputEvent(){
    console.log(inp.value());
    peerid=inp.value();
    conn=peer.connect(peerid);
    conn.on("data", onRecvMessage);
    
    swi2=false;
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
    
    swi2=true;
    start();
});

function onRecvMessage(data){
    console.log(data);
    if(data=="turnswitch"){
        swi2=true;
    }
}

function start(){
    swi1=true;
    if(swi2)    console.log("先手");
        else    console.log("後手");
    button.remove();
    inp.remove();

}

function mouseClicked(){
    if(swi2==true){
        swi2=false;
        conn.send("turnswitch");
    }
}


 
