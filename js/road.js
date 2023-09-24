class Road{
    constructor(x,width, laneCount=4){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        
        this.left = x-width/2;
        this.right = x+width/2;

        // Infinity from JS seems to cause to weird behaviour
        const infinity = 100000000;
        this.top = -infinity;
        this.bottom = +infinity;
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // let i;
        for(let i=0;i<=this.laneCount;i++){
            /* To draw multiple lanes, the x-coordinate of the lane(where it starts) is required, depending upon the laneCount, there will be more lanes, with different x-coordinates, which are calculated using linear interpolation */
            const x = lerp(
                this.right,
                this.left,
                // These left and right values are calculated as per a % | when i>1, % values will be calculated 
                i/this.laneCount
            );
            if(i>0 && i<this.laneCount){
                // Adding dashed lines for splitting the lanes | [20,20] - 20 px long, 20px space
                ctx.setLineDash([20,20]);
            }else{
                ctx.setLineDash([]);
            }
            // Drawing vertical lines on left and right of the screens
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}
