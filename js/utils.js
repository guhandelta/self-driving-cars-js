
function lerp(A,B,t) {
    /* A & B are endpoints, and, when laneCount increases the next lane moves away from the current A */
    return A+(B-A)*t;
}