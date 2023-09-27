
function lerp(A,B,t) {
    /* A & B are endpoints, and, when laneCount increases the next lane moves away from the current A */
    return A+(B-A)*t;
}


function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return{
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset: t
            }
        }
    }
    return null;
}

// Essentially, this fn() takes all the segments that makes the 1st polygon and compares them with all the segments of the 2nd polygon
function polysIntersect(poly1, poly2){
    
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch = getIntersection(
                poly1[i], 
                // This is to find the next point in the 1st polygon, so in a way it creates segments from one point to the next. But in the end, this may throw an error when i reaches the length of the polygon, as the point would go out of the polygon. But using the %(modulo) operator here would make that value as 0, and that is good in a way as the last point in the polygon should connect to the first point of the next polygon(which is the line segments here).
                poly1[(i+1)%poly1.length], 
                poly2[j], 
                poly2[(j+1)%poly2.length], 
            );
            console.log(touch);
            if(touch) {
                return true;
            }
        }
    }
    return false;
}