class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3){
        // Store the args as attributes to record the dimensions and position of the car
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;
        // if controlType=="AI", the brain that the car already has, will be used
        this.useBrain = controlType=="AI";

        // Draw the sensors only for the car driven by the user
        if(controlType != "BOT"){
            this.sensor = new Sensor(this); // this => passing tha Car to Sensor
            this.brain = new NeuralNetwork(
                // Specify the Array of Neuron counts or Size of the layer
                // 1 hidden layer with 6 neurons, and another layer with 4 neurons -> 4 directions
                [this.sensor.rayCount, 6, 4]
            );
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic){
        // The car should not move/not allowed to move when damaged, 
        if(!this.damaged){    
            this.#motion();
            // Updates the points after the  car moves
            this.polygon = this.#createPolygon();
            // Assess damage with Border Collision and Traffic
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            // While the sensor will still work even when the car is damaged
            this.sensor.update(roadBorders, traffic);
            // Take out the offsets from the sensor readings, after updating the sensors
            const offsets = this.sensor.readings.map(
                // This is done to make sure the neurons get a higher value close 1 when the object is closer or a smaller value closer to 0 when the object is far away
                s => s === null ? 0 /*There is no reading here*/ : 1-s.offset
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.backward = outputs[3];
            }
        }
    }

    #motion(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.backward){
            this.speed -= this.acceleration;
        }

        // Setting the max speed of the car
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        // There is no -ve speed, it just means the car is moving backwards
        if(this.speed <- this.maxSpeed/2){
            this.speed =- this.maxSpeed/2;
        }

        // Adding friction to the car corresponding to the direction it it moving
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
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

    /* The color of the car changes even with this complicated design as each of the segment that is forming this polygon(car) is compared with the borders of the
     road. This method is quite general and works with complicated polygons as well, but it can become slow if there are many points, where some optimizations like
     looking at the bounding boxes, or something like that, would be requried. This is reliable when the object doesn't move faster, like if the cars moves very fast,
     it can jump over a border, or even another car in traffic, and that would require a different collision detection strategy for that. 
     
    When zoomed in, it would be visible that the car's color would not change, when it scrapes over the road border, as the color of the car should change when it
    touches the road borders, the fact here is that the lines have no thickness, and that is why it may look like the car and road border are intersecting, but they 
    really aren't. This can be fixed by replacing the road with inifinitel long tiny rectangles.
    */
    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            // polysIntersect will take in 2 polygons | roadBorders[i] is not a polygon, but a segment, but it will be general enough for it to work
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        // The car in the traffic that is getting hit will not be damaged, as the user's car is not it it's traffic list
        for(let i=0;i<traffic.length;i++){
            // polysIntersect will take in 2 polygons | roadBorders[i] is not a polygon, but a segment, but it will be general enough for it to work
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    // The Corners of the, car are not known(coordinates) with the way the car is drawn and rotated
    #createPolygon(){
        // One point per corner of the car, and more points can be added and can have different shapes
        const points=[];
        // Visualize or Consider the car as an upright Rectangle : Refer car corners.png & car corners1.png for better idea
        // Hypotenuse of the triangle (i.e.) distance from the center of the car to the corners, getting a half of that hypotenuse, gives the distance from the center of the car to a corner
        const radius = Math.hypot(this.width, this.height)/2;
        // The angle between the line from the center of the car and the sraight line drawn in the direction of the car is same as the angle between the height and the hypotenuse of the car, as the angles are the same no matter where a line is drawn on the hypotenuse, parallel to the height
        const alpha = Math.atan2(this.width, this.height);
        // Top right point
        points.push({
            // center x of the car -sin(this car angle - alpha angle) => Literally combining car angle and alpha angle and multiply these by the radius
            x: this.x-Math.sin(this.angle-alpha)*radius,
            y: this.y-Math.cos(this.angle-alpha)*radius,
        });
        // Top left point
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*radius,
            y: this.y-Math.cos(this.angle+alpha)*radius,
        });
        // Bottom left point
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*radius,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*radius,
        });
        // Bottom right point
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*radius,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*radius,
        });

        return points;
    }

    draw(ctx, color, drawSensors=false){


        // *********** Since the corners of the car are not known when drawing the car in this method,........

      /*  // Rotating the unit circle
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
        ctx.restore();*/
            

        // ...... the car can now be drawn using the private function #createPolygon(), where the corners are known and updated promptly as the car moves ***********
        
        if(this.damaged){
            ctx.fillStyle="orange";
        }else{
            ctx.fillStyle=color;
        }

        ctx.beginPath();
        // move to the first point in the polygonn
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        // Loop through all the points within polygon[], the iteration starts from i=1 because the first point has been already visited 
        for(let i=0;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        // Avoid drawing the sensors for the bot cars
        if(this.sensor && drawSensors){
            // Making the sensor draw itself => The car has it's own responsibility to draw the sensor    
            this.sensor.draw(ctx);
        }
    }

}