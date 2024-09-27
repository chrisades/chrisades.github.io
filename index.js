const canvas = document.getElementById('canvas1');
const mainBody = document.getElementById('main-body');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];

class Symbol {
    constructor(x, y, fontSize, canvasHeight, canvasWidth){
        this.characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
    }
    draw(context){
        this.text = this.characters.charAt(Math.floor(Math.random()*this.characters.length));
        context.fillText(this.text, this.y * this.fontSize, this.x * this.fontSize);
        if (this.y * this.fontSize > this.canvasWidth && Math.random() > 0.97){
            this.y = 0;
        } else {
            this.y += 1;
        }
    }
}

class Effect {
    constructor(canvasWidth, canvasHeight){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 15; //15
        this.columns = this.canvasWidth/this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
    #initialize(){
        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = new Symbol(i, this.canvasHeight / Math.random(), this.fontSize, this.canvasHeight, this.canvasWidth)
            }
    }
    resize(width, height){
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasHeight/this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height);

const mouse = {
    x: undefined,
    y: undefined,

}

mainBody.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle('black'));
    }
});

// for smartphones
mainBody.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle('black'));
    }
});

// in-case for when main body is smaller than canvas
canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle('black'));
    }
});
canvas.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle('black'));
    }
});

// Ink brush effect
class Particle {
    constructor(color){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 30 + 5;
        this.speedX = 1*Math.abs(Math.random() * 5 - 1.5);
        this.speedY = 1*Math.abs(Math.random() * 3 - 1.5);
        this.color = color; // Paint color
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.7) this.size -= 0.35;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        // ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size) //paint shape square
        //ctx.roundRect(this.x - (this.size/2)/2, this.y - 2*(this.size)/2, this.size/2, 2*this.size, 1000) //paint shape round bar
        ctx.fill();
    }
}
function handleParticles(){
    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.7){
            if (particlesArray.length > 1){
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }
}

let lastTime = 0;
const fps = 40; //45
const nextFrame = 1000/fps;
let timer = 0;

function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.textAlign = 'center';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'hsla(180, 100%, 30%)'; //text  color
        ctx.font = effect.fontSize + 'px wavefont';
        
        effect.symbols.forEach(symbol => symbol.draw(ctx));
        timer = 0;
    } else{
        timer += deltaTime;
    }
    handleParticles();
    requestAnimationFrame(animate);
}
animate(0);
effect.resize(canvas.width, canvas.height);

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height);
})

