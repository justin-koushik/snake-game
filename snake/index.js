const can=document.querySelector('canvas')
const ctx=can.getContext("2d")
const w=500
const h=500
const dx=25
const nrows=h/dx
const ncols=w/dx

can.width=w
can.height=h

const drawBoard=()=>{
    ctx.strokeStyle='rgba(0,0,0,0.4)'
    for(let i=0;i<=h;i=i+dx){
        ctx.beginPath()
        ctx.moveTo(0,i)
        ctx.lineTo(w,i)
        ctx.stroke()
        ctx.closePath()
    }
    for(let i=0;i<=w;i=i+dx){
        ctx.beginPath()
        ctx.moveTo(i,0)
        ctx.lineTo(i,h)
        ctx.stroke()
        ctx.closePath()
    }
}

class snake{
    constructor(x,y){
        this.hX=x
        this.hY=y
        this.dirX=1
        this.dirY=0
        this.tail=[[this.hX+this.dirX,this.hY+this.dirY]]
        this.state=true
        this.getFood()
    }
    reset(){
        this.tail=[]
        this.dirX=1
        this.dirY=0
    }
    getFood(){
        this.fX=Math.random()*ncols>>0
        this.fY=Math.random()*nrows>>0
    }
    draw(){
        ctx.fillStyle="red"
        ctx.beginPath()
        ctx.rect(this.fX*dx,this.fY*dx,dx,dx)
        ctx.fill()
        ctx.closePath()
        ctx.fillStyle='black'
        ctx.beginPath()
        ctx.arc(this.hX*dx+dx/2,this.hY*dx+dx/2,dx/2,0,Math.PI*2)
        ctx.fill()
        ctx.closePath()
        ctx.fillStyle='yellow'
        for(let part of this.tail){
            ctx.beginPath()
            ctx.arc(part[0]*dx+dx/2,part[1]*dx+dx/2,dx/2,0,Math.PI*2)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        }
    }
    main(){
        if(this.state){
            ctx.clearRect(0,0,w,h)
            drawBoard()
            this.draw()
            if(this.fX==this.hX && this.fY==this.hY){
                this.getFood()
                let tx=this.hX+this.dirX
                let ty=this.hY+this.dirY
                this.tail.push([tx,ty])
            }
            let isCollide=this.tail.filter(e=>{
                return e[0]==this.hX && e[1]==this.hY
            })
            if(isCollide.length===1){
                this.reset()
            }
            this.tail.unshift([this.hX,this.hY])
            this.tail.pop()
            this.hX+=this.dirX
            this.hY+=this.dirY
            if(this.hX<0){
                this.hX=ncols-1
            }
            if(this.hX>ncols-1){
                this.hX=0
            }
            if(this.hY<0){
                this.hY=nrows-1
            }
            if(this.hY>nrows-1){
                this.hY=0
            }
        }
    }   
}
const game=new snake(nrows/2>>0,ncols/2>>0)
document.onkeydown=(e)=>{
    let key=e.key
    console.log(key)
    if(key==='ArrowRight' && game.dirX!==-1){
        game.dirX=1
        game.dirY=0
    }
    if(key==='ArrowLeft' && game.dirX!==1){
        game.dirX=-1
        game.dirY=0
    }
    if(key==='ArrowUp' && game.dirY!==1){
        game.dirY=-1
        game.dirX=0
    }
    if(key==='ArrowDown' && game.dirY!==-1){
        game.dirY=1
        game.dirX=0
    }
    if(key===' '){
        game.state=!game.state
    }
}

const fps=10
const fInterval=1000/fps
let then=Date.now()
let now,elapsed
function animate(){
    requestAnimationFrame(animate)
    now=Date.now()
    elapsed=now-then
    if(elapsed>fInterval){
        game.main()
        then=now-(elapsed%fInterval)
    }
}

animate()