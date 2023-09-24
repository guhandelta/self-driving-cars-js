class Car{
    constructor(x, y, width, height){
        // Store the args as attributes to record the dimensions and position of the car
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.controls = new Controls();
    }

    draw(ctx){
        // beginPath() from Canvas 2D API starts a new path by emptying the list of sub-paths. This also used to create a new path
        ctx.beginPath();
        // rect() from Canvas 2D API adds a rectangle to the current path, which will be used to draw the car. 
        ctx.rect(
            // center of the car
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height
        );
        // fill() from Canvas 2D API fills the current or given path with the current fillStyle. 
        ctx.fill();
    }

    update(){
        if(this.controls.forward){
            this.y-=2
        }
        if(this.controls.backward){
            this.y+=2
        }
        if(this.controls.left){
            this.x-=2
        }
        if(this.controls.right){
            this.x+=2
        }
    }
}