class Car{
    constructor(x, y, width, height){
        // Store the args as attributes to record the dimensions and position of the car
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        this.controls = new Controls();
    }

    update(){
        this.#motion();
    }

    #motion(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.backward){
            this.speed -= this.acceleration;
        }

        // Setting the max speed of the car
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        // There is no -ve speed, it just means the car is moving backwards
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        // Adding friction to the car corresponding to the direction it it moving
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }

        // If speed !=0, then the friction will bounce the car around and keep it moving, after the key release and car stops slowly with fricion,with travelling a few pixels ahead of where the key was released
        // To prevent the car constantly move in tiny amounts, even after sometime the key is released
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        
        // Providing approrpiate maxSpeed for left and right movements
        /* The angle works here as per the unit circle(https://upload.wikimedia.org/wikipedia/commons/7/72/Sinus_und_Kosinus_am_Einheitskreis_1.svg), but in this case the unit circle is rotated 90deg counter clockwise with the 0 to pi on the top and bottom axes */
        if(this.speed!=0){   
            // Flipping the right-left directions of the car, depending upon the direction of it's motion
            const flip = this.speed>0?1:-1;   
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }   
        }        
        // The unit circle has a radius of 1 and hte sine is between 1 & -1, which is scaled as per the vaue of y
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        // Rotating the unit circle
        ctx.save(); //save the context
        ctx.translate(this.x, this.y); // Translate the circle to the point where the rotation to be centered at
        ctx.rotate(-this.angle)
        // beginPath() from Canvas 2D API starts a new path by emptying the list of sub-paths. This also used to create a new path
        ctx.beginPath();
        // rect() from Canvas 2D API adds a rectangle to the current path, which will be used to draw the car. 
        ctx.rect(
            // center of the car 
            // this.x & this.y are removed, as the circle is already translated to that point on ln:63
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        // fill() from Canvas 2D API fills the current or given path with the current fillStyle. 
        ctx.fill();
        // Restoring the canvas, to prevent translating and rotating for every single frame
        ctx.restore();
    }

}