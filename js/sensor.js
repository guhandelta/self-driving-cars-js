class Sensor{
    constructor(car){// Sensor constructor takes in the car object so teh sensor knows where the car is
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 100; // Range of the ray till which it can sense obstacles
        this.raySpread = Math.PI/2; // PI/2 = 90deg, the angles of the ray beams cast by the sensor

        this.rays=[]; // To hold each rays, once they are created
    }

    update(){
        this.rays=[]; // this arraye is what that will be populated 1st
        for(let i=0;i<this.rayCount;i++){
          const rayAngle = lerp(
            this.raySpread/2,
            -this.raySpread/2,
            // i won't be equal to rayCount, but rather rayCount-1
            this.rayCount===1?0.5:i/(this.rayCount-1) // 0.5 => display a straight line when rayCount is 1, as this.rayCount-1=0 and i cannot be divided by 0 => no ray lines visible/displayed
          )+this.car.angle;  
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
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            // Rays start location
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            // Rays end location
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();
        }
    }
}