let block=new Array(17);
for(let i=0;i<17;i++)   block[i]=new Array(17);
let ts=60,rs=15,px=50,py=50,mode=0,c=6,r=6,ec=6,er=6;
let dir=[[[-1,0],[1,0]],[[0,-1],[0,1]]],col=['#3a57fd','#f14434'];
let pnum=1,mem,start=true;
let myturn,turn=0;
let wall=10;
let peer,room,id="";

function setup(){
    createCanvas(windowWidth,windowHeight);
    
    console.log("ver.2.0.1");

    peer=new Peer({
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug:1
    });
    peer.on('open',()=>{
        id=peer.id;
        room=peer.joinRoom("rooma",{
            mode:'sfu'
        });
        room.on('open',()=>{
            pnum=room.members.length+1;
            for(let i=2;i<15;i+=2)  block[i][16]=7;
            if(pnum==1) myturn=true;
            else    turn=1;
            mem=pnum;
        });
        room.on('peerJoin',peerId=>{
            console.log(peerId+"参加");
            mem++;
        });
        room.on('peerLeave',peerId=>{
            console.log(peerId+"退出");
        });
        room.on('data',message=>{
            console.log(message.data);
            receive(message.data);
        });
    });

    for(let i=0;i<17;i++)   for(let j=0;j<17;j++)   block[i][j]=0;
}

function draw(){
    background(255);

    let pc=-1,pr=-1;
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        if(mouseX>i*(ts+rs)+px&&mouseX<i*(ts+rs)+ts+px&&mouseY>j*(ts+rs)+py&&mouseY<j*(ts+rs)+ts+py){
            if(block[i*2][j*2]==7){
                pc=i*2;
                pr=j*2;
            }
            break;
        }
    }

    for(let i=0;i<17;i++)   for(let j=0;j<17;j++)   if(block[i][j]==1)  block[i][j]=0;
    if(pc==-1&&myturn&&start==false)    for(let i=0;i<8;i++)   for(let j=0;j<8;j++){
        if(dist(mouseX,mouseY,ts+i*(ts+rs)+rs/2+px,ts+j*(ts+rs)+rs/2+py)<ts/3){
            if(block[i*2+1][j*2+1]==0&&block[i*2+1+dir[mode][0][0]][j*2+1+dir[mode][0][1]]==0
                &&block[i*2+1+dir[mode][1][0]][j*2+1+dir[mode][1][1]]==0&&wall>0){
                block[i*2+1][j*2+1]=1;
                block[i*2+1+dir[mode][0][0]][j*2+1+dir[mode][0][1]]=1;
                block[i*2+1+dir[mode][1][0]][j*2+1+dir[mode][1][1]]=1;
            }
            break;
        }
    }

    noStroke();
    for(let i=0;i<17;i++)   for(let j=0;j<17;j++){
        if(block[i][j]==1)  fill(150);
        else if(block[i][j]>=8&&block[i][j]<=11) fill(col[block[i][j]-8]);
        else    fill(255);
        if(i%2==0&&j%2==0)  fill(200);
        if(block[i][j]==7&&myturn){
            fill("#ffcc88");
            if(i==pc&&j==pr)    fill('#ff7700');
        }
        rect(ts*int((i+1)/2)+rs*int(i/2)+px,ts*int((j+1)/2)+rs*int(j/2)+py,(i%2)*rs+((i+1)%2)*ts,(j%2)*rs+((j+1)%2)*ts);

        if(block[i][j]>=3&&block[i][j]<=6){
            fill(col[block[i][j]-3])
            circle(ts*int((i+1)/2)+rs*int(i/2)+ts/2+px,ts*int((j+1)/2)+rs*int(j/2)+ts/2+py,ts*0.7);
        }
    }

    if(turn%2==0) strokeWeight(12);    else    strokeWeight(4);
    stroke(col[pnum-1]);
    line(px,py+9*ts+8*rs+10,px+9*ts+8*rs,py+9*ts+8*rs+10);
    if(turn%2==1) strokeWeight(12);    else    strokeWeight(4);
    stroke(col[(pnum)%2]);
    if(mem>1)   line(px,py-10,px+9*ts+8*rs,py-10);


    noStroke(),fill(0),textSize(30);
    text(wall,700,760);
}

function mouseClicked(){
    let flag=true;

    if(myturn){
        if(start==true)    start=false;
        for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
            if(mouseX>i*(ts+rs)+px&&mouseX<i*(ts+rs)+ts+px&&mouseY>j*(ts+rs)+py&&mouseY<j*(ts+rs)+ts+py){
                if(block[i*2][j*2]==7){
                    block[i*2][j*2]=pnum+2;
                    block[c][r]=0;
                    room.send(pnum+',m,'+c+','+r+','+i*2+','+j*2);
                    c=i*2;
                    r=j*2;
                    myturn=false;
                    turn=(turn+1)%4;
                    flag=false;
                }
                break;
            }
        }

        if(flag)    for(let i=0;i<8;i++)   for(let j=0;j<8;j++){
            if(dist(mouseX,mouseY,ts+i*(ts+rs)+rs/2+px,ts+j*(ts+rs)+rs/2+py)<ts/3){
                if(block[i*2+1][j*2+1]==1&&block[i*2+1+dir[mode][0][0]][j*2+1+dir[mode][0][1]]==1
                &&block[i*2+1+dir[mode][1][0]][j*2+1+dir[mode][1][1]]==1){
                    
                    block[i*2+1][j*2+1]=pnum+7;
                    block[i*2+1+dir[mode][0][0]][j*2+1+dir[mode][0][1]]=pnum+7;
                    block[i*2+1+dir[mode][1][0]][j*2+1+dir[mode][1][1]]=pnum+7;
                    
                    if(enable2()){
                        room.send(pnum+',w,'+mode+','+(i*2+1)+','+(j*2+1));
                        myturn=false;
                        wall--;
                        turn=(turn+1)%4;
                    }else{
                        block[i*2+1][j*2+1]=0;
                        block[i*2+1+dir[mode][0][0]][j*2+1+dir[mode][0][1]]=0;
                        block[i*2+1+dir[mode][1][0]][j*2+1+dir[mode][1][1]]=0;
                    }              
                    
                }
                break;
            }
        }
    }
}

function mouseWheel(){
    mode=(mode+1)%2;
}

function keyPressed(){
    if(key=='r'){
        reset();
        room.send("reset");
    }
    if(key=='c'){
        room.send("close");
    }
    if(key=='a')    mode=(mode+1)%2;
    if(keyCode==SHIFT)  mode=(mode+1)%2;
}

function enable(){

    if(start==false){
        let d=[[0,-1],[1,0],[0,1],[-1,0]];
        for(let i=0;i<17;i++)   for(let j=0;j<17;j++)   if(block[i][j]==7)  block[i][j]=0;
        for(let i=0;i<4;i++){
            if(ins(c+d[i][0],r+d[i][1])){
                if(block[c+d[i][0]][r+d[i][1]]==0){
                    if(block[c+d[i][0]*2][r+d[i][1]*2]==0)  block[c+d[i][0]*2][r+d[i][1]*2]=7;
                    else{
                        if(ins(c+d[i][0]*3,r+d[i][1]*3)){
                            if(block[c+d[i][0]*3][r+d[i][1]*3]==0&&block[c+d[i][0]*4][r+d[i][1]*4]==0)  block[c+d[i][0]*4][r+d[i][1]*4]=7;
                            else    if(block[c+d[i][0]*3][r+d[i][1]*3]!=0){
                                let cc=c+d[i][0]*2,rr=r+d[i][1]*2;
                                for(let j=0;j<4;j++){
                                    if(ins(cc+d[j][0],rr+d[j][1])){
                                        if(block[cc+d[j][0]][rr+d[j][1]]==0&&block[cc+d[j][0]*2][rr+d[j][1]*2]==0)
                                            block[cc+d[j][0]*2][rr+d[j][1]*2]=7;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function enable2(){
    let result=[false,false];
    let d=[[0,-1],[1,0],[0,1],[-1,0]];
    let maze=new Array(9);
    for(let i=0;i<9;i++)    maze[i]=new Array(9);
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    maze[i][j]=0;

    for(let player=0;player<2;player++){

        for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
            maze[i][j]=0;
        }
        
        if(player==1)   maze[c/2][r/2]=1;
        else    maze[ec/2][er/2]=1;

        let flag=false;
        for(let loop=0;loop<80;loop++){
            for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
                for(let k=0;k<4;k++){
                    if(ins(i*2+d[k][0]*2,j*2+d[k][1]*2)){
                        if(maze[i][j]==0&&maze[i+d[k][0]][j+d[k][1]]==1&&block[i*2+d[k][0]][j*2+d[k][1]]==0){
                            maze[i][j]=1;
                            flag=true;
                            if(j==8-player*8){
                                loop=80;
                                result[player]=true;
                            }
                            i=9,j=9,k=4;
                        }
                    }
                }
                if(i==8&&j==8)  loop=80;
            }
        }
    }

    if(result[0]&&result[1])    return true;
    else    return false;
}

function ins(cc,rr){
    if(cc>=0&&cc<17&&rr>=0&&rr<17)  return true;
    else    return false;
}

function receive(s){
    if(s=="reset")  reset();
    else if(s=="close") room.close();
    else    cmd(s);
}

function reset(){
    wall=10;
    start=true;
    for(let i=0;i<17;i++)   for(let j=0;j<17;j++){
        block[i][j]=0;
    }
    for(let i=2;i<15;i+=2)  block[i][16]=7;
    if(pnum==1) pnum=2;
    else    pnum=1;
    if(pnum==1) myturn=true;
    else    myturn=false;
    turn=pnum-1;
    c=6;
    r=6;
    let tem=col[0];
    col[0]=col[1];
    col[1]=tem;

}

function cmd(s){
    s=s.split(',');
    s[0]=int(s[0]);
    if(s[1]=='m'){
        block[ conc(s[2],s[3],s[0]) ][ conr(s[2],s[3],s[0]) ]=0;
        block[ conc(s[4],s[5],s[0]) ][ conr(s[4],s[5],s[0]) ]=s[0]+2;
        ec = conc(s[4],s[5],s[0]);
        er = conr(s[4],s[5],s[0]);
        enable();
        turn++;
    }
    if(s[1]=='w'){
        for(let i=2;i<5;i++)    s[i]=int(s[i]);
        block[ conc(s[3],s[4],s[0]) ][ conr(s[3],s[4],s[0]) ]=s[0]+7;
        if(s[2]==0){
            block[ conc(s[3],s[4],s[0])-1 ][ conr(s[3],s[4],s[0]) ]=s[0]+7;
            block[ conc(s[3],s[4],s[0])+1 ][ conr(s[3],s[4],s[0]) ]=s[0]+7;
        }else{
            block[ conc(s[3],s[4],s[0]) ][ conr(s[3],s[4],s[0])-1 ]=s[0]+7;
            block[ conc(s[3],s[4],s[0]) ][ conr(s[3],s[4],s[0])+1 ]=s[0]+7;
        }
        enable();
        turn++;
    }

    myturn=true;
    return s;
}

function conc(c,r,n){
    return 16-c;
}

function conr(c,r,n){
    return 16-r;
}
