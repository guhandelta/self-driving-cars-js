class Road{
    constructor(x,width, laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        
        this.left = x-width/2;
        this.right = x+width/2;

        // Infinity from JS seems to cause to weird behaviour
        const infinity = 100000000;
        this.top = -infinity;
        this.bottom = +infinity;
        // This array will hold segments made of 2 points each
        const topLeft = { x:this.left, y:this.top };
        const topRight = { x:this.right, y:this.top };
        const bottomLeft = { x:this.left, y:this.bottom };
        const bottomRight = { x:this.left, y:this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        // Calculate the offset of laneWidth away form the center of the 1st lane
        return this.left+laneWidth/2+Math.min(laneIndex, this.laneCount-1)*laneWidth
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // let i;
        for(let i=1;i<=this.laneCount-1;i++){
            /* To draw multiple lanes, the x-coordinate of the lane(where it starts) is required, depending upon the laneCount, there will be more lanes, with different x-coordinates, which are calculated using linear interpolation */
            const x = lerp(
                this.right,
                this.left,
                // These left and right values are calculated as per a % | when i>1, % values will be calculated 
                i/this.laneCount
            );
            
            ctx.setLineDash([20,20]);
            // Drawing vertical lines on left and right of the screens
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // The lines can be drwan separately as the borders are defined(ln:19), and also for any changes like curved roads to reflect on the UI
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    } 
}
