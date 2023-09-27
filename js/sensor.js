class Sensor{
    constructor(car){// Sensor constructor takes in the car object so the sensor knows where the car is
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150; // Range of the ray till which it can sense obstacles
        this.raySpread = Math.PI/2; // PI/2 = 90deg, the angles of the ray beams cast by the sensor

        this.rays=[]; // To hold each rays, once they are created
        this.readings=[]; // Tells if there is a border and how far is it
    }
    
    update(roadBorders, traffic){
        // roadBorders can be used here to sense if the road borders are closer, with the sensors
        this.#castRays();
        this.readings=[]; 
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    // fn() to detect & record where rays touch any borders
    #getReading(ray, roadBorders, traffic){
        // touches[] may include road borders or polygon segments from the traffic
        let touches = [];
        for(let i=0;i<roadBorders.length;i++){
            const touch = getIntersection(
                // 1 Segment
                ray[0],
                ray[1],
                // 2 Segment
                roadBorders[i][0],
                roadBorders[i][1]
            );
            // getIntersection() may return null so add only the segements within the ray's line of sight
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly= traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length],
                );
                if(value) touches.push(value);
            }
        }

        // The car has'nt encounter anything 
        if(touches.length===0){
            return null;
        } else{
            // getIntersection() also returns the offset(distance between the object encountered and the center of the car)
            // Collect all the offsets for all the touches in an array
            const offsets=touches.map(e => e.offset);
            // Get the nearest object by finding the smallest offset
            const minOffset = Math.min(...offsets); // array is spread within the min() as min() doesn't accept arrays, but some values
            // return the touch that has the minimum offset 
            return touches.find(e=>e.offset == minOffset);
        }
    }

    #castRays(){
        this.rays=[]; // this arraye is what that will be populated 1st
        for(let i=0;i<this.rayCount;i++){
          const rayAngle = lerp(
            this.raySpread/2,
            -this.raySpread/2,
            // i won't be equal to rayCount, but rather rayCount-1
            this.rayCount===1?0.5:i/(this.rayCount-1) // 0.5 => display a straight line when rayCount is 1, as this.rayCount-1=0 and i cannot be divided by 0 => no ray lines visible/displayed
          )+this.car.angle; // Making the Sensor rays responsive with the car's angle as it turns 
          const start = { x:this.car.x, y:this.car.y };
          const end = { 
            // Unit circle is just 1px radius, so scale it up
            x: this.car.x-Math.sin(rayAngle)*this.rayLength,
            y: this.car.y-Math.cos(rayAngle)*this.rayLength,
           };
         //Push these into the  rays array to create segments  
         this.rays.push([start, end]);
        }
    }

    // Draw the sensors
    draw(ctx){
        // Iterate through the rays[]
        for(let i=0;i<this.rayCount;i++){
            let end = this.rays[i][1]; //endPoint in rays[]
            if(this.readings[i]){
                // This makes end as a point with x and y attributes
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            // Ray start location
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            // Ray end location, which will be till the nearest object that specific ray touches
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            // Visualizing where the line would've reached, past the object
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="red";
            // Ray start location, from where the tip of the end of the ray could be
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            // Ray end location, if it is a reading or not, if not, it will be a tiny line that can be barely visible
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}
